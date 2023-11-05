from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework import generics
from rest_framework.response import Response
from .models import TestResult
from .serializers import TestResultSerializer
# Create your views here.

@login_required(login_url='/TeleMindCare/Login')
def ansiedad(request):
    return render(request,"tests/Ansiedad.html")
@login_required(login_url='/TeleMindCare/Login')
def depresion(request):
    return render(request,"tests/Depresion.html")
@login_required(login_url='/TeleMindCare/Login')
def bornout(request):
    return render(request,"tests/Burnout.html")



class TestResultCreateView(generics.CreateAPIView):
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer

    def create(self, request, *args, **kwargs):
        # Asegurarse de que el usuario actual sea el propietario del resultado
        request.data['usuario'] = request.user.id
        return super().create(request, *args, **kwargs)
