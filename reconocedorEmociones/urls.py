from django.urls import path
from reconocedorEmociones import views



urlpatterns = [
    path('Analizador-emociones', views.analizador_emociones,name="Analizador"),
    path('Cargar-video', views.cargar_video, name='cargar_video'),
    
]