from django.urls import path
from tests import views

urlpatterns = [
    path('Tests/Ansiedad', views.ansiedad, name="Ansiedad"),
    path('Tests/Depresion', views.depresion, name="Depresion"),
    path('Tests/Estres', views.bornout, name="Estres"),
    path('Api/Tests/Create/', views.TestResultCreateView.as_view(), name='CreacionTest'),
]
