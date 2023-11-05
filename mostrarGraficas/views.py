from django.shortcuts import render, HttpResponse, redirect
from reconocedorEmociones.models import EmocionesUsuario
import pandas as pd
import matplotlib.pyplot as plt
import base64
from io import BytesIO
from django.contrib.auth.decorators import login_required

@login_required(login_url='/TeleMindCare/Login')
def mostrar_graficas(request, emociones_id):
    try:
        emociones_usuario = EmocionesUsuario.objects.get(id=emociones_id)
    except EmocionesUsuario.DoesNotExist:
       return redirect('Error')

    # Validar que el usuario autenticado sea el propietario de las emociones
    if request.user != emociones_usuario.usuario:
        return redirect('Error')

    data = {
        'Feliz': emociones_usuario.felicidad,
        'Triste': emociones_usuario.tristeza,
        'Enojado': emociones_usuario.enojo,
        'Sorprendido': emociones_usuario.sorpresa,
        'Neutral': emociones_usuario.neutral,
    }

    

    return render(request, 'mostrarGraficas/mostrar_graficas.html', {'emociones': emociones_usuario})