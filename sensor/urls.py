from django.urls import path
from sensor.views import tabla_oximetro


urlpatterns = [
    path('Oximetro', tabla_oximetro ,name="oximetro"),

]