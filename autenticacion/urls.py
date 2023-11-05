from django.urls import path
from autenticacion import views



urlpatterns = [
   path('Login',views.loguear,name="Login"),
   path('Register',views.register,name="Register"),
   path('Logout', views.cerrar_sesion,name="Logout"),
]