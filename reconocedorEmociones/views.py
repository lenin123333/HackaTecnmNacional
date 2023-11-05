from django.shortcuts import render, redirect
from threading import Thread
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.conf import settings
import cv2
import os
import tempfile
from .models import EmocionesUsuario
from django.contrib.auth.models import User
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
import mediapipe as mp
from deepface import DeepFace
import openai

@login_required(login_url='/TeleMindCare/Login')
def analizador_emociones(request):
    return render(request, "reconocedorEmociones/reconocedorEmociones.html")

detros = mp.solutions.face_detection
rostros = detros.FaceDetection(min_detection_confidence=0.8, model_selection=0)

temp_video_path = os.path.join(tempfile.gettempdir(), "temp_video.mp4")
# ...

def obtener_consejo_chat(emociones):
    # Configura la API key de OpenAI GPT-3
    openai.api_key = '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'  # Reemplaza con tu API key real

    # Define el prompt para obtener el consejo
    prompt = f"Dame un consejo basado en mis emociones: {emociones}"

    try:
        # Realiza la solicitud a la API de OpenAI GPT-3.5 Turbo
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=150,
            temperature=0.7,
        )

        # Extrae y devuelve la respuesta del chatbot
        return response.choices[0].text.strip()
    except Exception as e:
        print(f"Error al obtener consejo del chat: {e}")
        return None





def reconocer_emociones(video_path, user_id, base_url, delete_video=True):
    try:
        cap = cv2.VideoCapture(video_path)

        emociones_contador = {
            "Feliz": 0,
            "Triste": 0,
            "Enojado": 0,
            "Sorprendido": 0,
            "Neutral": 0,
        }

        while True:
            ret, frame = cap.read()

            if not ret:
                break

            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            resrostros = rostros.process(rgb)

            if resrostros.detections:
                for rostro in resrostros.detections:
                    al, an, c = frame.shape
                    box = rostro.location_data.relative_bounding_box
                    xi, yi, w, h = int(box.xmin * an), int(box.ymin * al), int(box.width * an), int(box.height * al)

                    info = DeepFace.analyze(rgb[yi:yi + h, xi:xi + w], actions=['emotion'], enforce_detection=False)

                    if info and len(info) > 0:
                        emocion_detectada = info[0]['dominant_emotion']

                        mapeo_emociones = {
                            "happy": "Feliz",
                            "sad": "Triste",
                            "angry": "Enojado",
                            "surprise": "Sorprendido",
                            "neutral": "Neutral"
                        }

                        if emocion_detectada in mapeo_emociones:
                            emociones_contador[mapeo_emociones[emocion_detectada]] += 1

        total_emociones = sum(emociones_contador.values())
        porcentajes_emociones = {emocion: (contador / total_emociones) * 100 for emocion, contador in emociones_contador.items()}

        # Obtener consejo del chat basado en las emociones
        consejo = obtener_consejo_chat(porcentajes_emociones)

        # Obtener el comentario del usuario (puedes cambiar esto según cómo obtienes el comentario del usuario)
        

        # Guardar en la base de datos
        cap.release()
        user = User.objects.get(pk=user_id)
        nombre_video = os.path.basename(video_path)
        emociones_usuario = EmocionesUsuario(
            usuario=user,
            felicidad=porcentajes_emociones["Feliz"],
            tristeza=porcentajes_emociones["Triste"],
            enojo=porcentajes_emociones["Enojado"],
            sorpresa=porcentajes_emociones["Sorprendido"],
            neutral=porcentajes_emociones["Neutral"],
            nombre_video=nombre_video,
            comentario=consejo,
        )

        emociones_usuario.save()

        enlace_resultado_emociones = reverse('mostrar_graficas', args=[emociones_usuario.id])
        url_completa = base_url + enlace_resultado_emociones

        asunto_correo = 'Video Analizado'
        cuerpo_correo = f"""
        <h1>Enhorabuena,</h1>

        <p>Tu video ha sido analizado con éxito y las emociones han sido registradas.</p>

        <p>Para ver los resultados, haz clic en el siguiente enlace:</p>

        <p><a href="{url_completa}">Ver resultados</a></p>

        <p>¡Gracias por utilizar nuestro servicio!</p>

        <p>Atentamente,<br>
        TeleMindCare</p>
        """

        correo_destinatario = user.email

        send_mail(
            asunto_correo,
            '',
            settings.DEFAULT_FROM_EMAIL,
            [correo_destinatario],
            html_message=cuerpo_correo
        )

        return porcentajes_emociones

    except Exception as e:
        print(f"Error en la función reconocer_emociones: {e}")
        return None


# ...

def reconocer_emociones_en_hilo(video_path, user_id, base_url):
    t = Thread(target=reconocer_emociones, args=(video_path, user_id, base_url))
    t.start()

@login_required(login_url='/TeleMindCare/login')
@csrf_exempt
@require_POST
def cargar_video(request):
    if 'video' not in request.FILES:
        return JsonResponse({"error": "No se ha proporcionado un archivo de video en la solicitud."}, status=400)

    video = request.FILES['video']

    if video.name == '':
        return JsonResponse({"error": "Nombre de archivo no válido."}, status=400)

    videos_folder = os.path.join(settings.BASE_DIR, 'TeleMindCareHome', 'static','TeleMindCareHome','videos')
    username_folder = request.user.username
    user_folder = os.path.join(videos_folder, username_folder)

    if not os.path.exists(user_folder):
        os.makedirs(user_folder)

    import uuid
    unique_filename = f"{uuid.uuid4().hex}.mp4"
    user_video_path = os.path.join(user_folder, unique_filename)

    while os.path.exists(user_video_path):
        unique_filename = f"{uuid.uuid4().hex}.mp4"
        user_video_path = os.path.join(user_folder, unique_filename)

    with open(user_video_path, 'wb') as user_video:
        for chunk in video.chunks():
            user_video.write(chunk)

    print("Video guardado exitosamente.")

    user_id = request.user.id
    reconocer_emociones_en_hilo(user_video_path, user_id, request.build_absolute_uri('/'))

    return redirect('Inicio')
