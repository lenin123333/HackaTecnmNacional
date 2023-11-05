# mostrarGraficas/urls.py
from django.urls import path
from .views import mostrar_graficas

urlpatterns = [
    path('ResultadoEmociones/<int:emociones_id>/', mostrar_graficas, name='mostrar_graficas'),
]
