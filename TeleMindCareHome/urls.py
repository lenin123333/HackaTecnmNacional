from django.urls import path
from TeleMindCareHome import views



urlpatterns = [
    path('', views.home,name="Home"),
    path('error', views.error,name="Error"),
    path('TeleMindCare/Inicio',views.inicio,name="Inicio"),
    path('TeleMindCare/Resultados-videos',views.showVideos,name="showVideos"),
    path('TeleMindCare/Resultados-tests',views.showGraficas,name="showGraficas"),
    path('TeleMindCare/Resultados-tests',views.showGraficas,name="showGraficas"),
     path('TeleMindCare/Chat-TeleMindCare', views.ChatTeleMindCare, name="chatTeleMindCare"),
    path('TeleMindCare/Chat-TeleMindCare-Video', views.ChatTeleMindCare_variiable, name="chatTeleMindCareVar"),
    path('TeleMindCare/ChatBot', views.chatbot, name='chatbot'),
]