from django.shortcuts import render,HttpResponse
from django.contrib.auth.decorators import login_required
from reconocedorEmociones.models import EmocionesUsuario
from tests.models import TestResult
from django.http import JsonResponse
import openai
from decouple import config
from django.views.decorators.csrf import csrf_exempt
import json
# Create your views here.


def home(request):
    return render(request,"TeleMindCareHome/home.html")

def error(request):
    return render(request,"TeleMindCareHome/error.html")


@login_required(login_url='/TeleMindCare/Login')
def inicio(request):
     return render(request,"TeleMindCareHome/inicio.html")

@login_required(login_url='/TeleMindCare/Login') 
def showGraficas(request):
    # Verifica si el usuario está autenticado
    if request.user.is_authenticated:
        # Recupera las emociones del usuario logueado
        test_usuarios = TestResult.objects.filter(usuario=request.user)

        # Puedes ordenar las emociones por fecha de creación si es necesario
        

        # Pasa las emociones al contexto de la plantilla
        context = {'test_usuarios': test_usuarios}

       
        return render(request,"TeleMindCareHome/ShowGraficas.html", context)
    else:
        # Maneja el caso en el que el usuario no está autenticado
        # Puedes redirigirlo a la página de inicio de sesión u otra página
        return render(request, "error.html")
    


@login_required(login_url='/TeleMindCare/Login')
def showVideos(request):
    # Verifica si el usuario está autenticado
    if request.user.is_authenticated:
        # Recupera las emociones del usuario logueado
        emociones_usuario = EmocionesUsuario.objects.filter(usuario=request.user)

        # Puedes ordenar las emociones por fecha de creación si es necesario
        emociones_usuario = emociones_usuario.order_by('-fecha_creacion')

        # Pasa las emociones al contexto de la plantilla
        context = {'emociones_usuario': emociones_usuario}

        return render(request, "TeleMindCareHome/ShowVideos.html", context)
    else:
        # Maneja el caso en el que el usuario no está autenticado
        # Puedes redirigirlo a la página de inicio de sesión u otra página
        return render(request, "error.html")
    
    

@csrf_exempt 
def chatbot(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            user_message = data.get('mensaje_platica', '')
            print('User Message:', user_message)

            # Lógica para enviar la consulta del usuario a la API de OpenAI
            openai.api_key = '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'

            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt="Actua para dar consejos de ayuda y para escuchar a las personas. Pero recuerda si interpretas que el problema es grave debes decirles que busquen ayuda profesional en TeleMindCare "+user_message,
                max_tokens=300,
                temperature=0.8,
            )

            bot_response = response.choices[0].text.strip()

            # Devuelve la respuesta del bot como JSON
            return JsonResponse({'bot_response': bot_response})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'})
        except Exception as e:
            return JsonResponse({'error': str(e)})

    return JsonResponse({'error': 'Invalid request method'})


@login_required(login_url='/TeleMindCare/Login')
def ChatTeleMindCare_variiable(request):
    texto_largo = request.GET.get('preguntar', '')  # Obtener el valor de 'preguntar' de la URL, si no está presente, devuelve una cadena vacía.
    return render(request, "TeleMindCareHome/ChatTeleMindCare.html", {'preguntar': texto_largo})


@login_required(login_url='/TeleMindCare/Login')
def ChatTeleMindCare(request):
    return render(request, "TeleMindCareHome/ChatTeleMindCare.html")

