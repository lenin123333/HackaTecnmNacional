from django.shortcuts import render
from .models import LecturasSensor  # Asegúrate de usar la ruta correcta a tu modelo
from datetime import datetime
from django.contrib.auth.models import User

# Create your views here.
def tabla_oximetro(request):
    id_usuario = request.user.id 
    usuario = User.objects.get(pk=id_usuario)
    # Obtener los registros de UsuariosSensor (puedes ajustar esta consulta según tus necesidades)
    datos_sensores = LecturasSensor.objects.filter(nombreusu=usuario)
    return render(request, 'sensor/usuarioSensor.html', {'datos_sensores': datos_sensores})