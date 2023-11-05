from django.db import models
from django.conf import settings

# Create your models here.
class UsuariosSensor(models.Model):
    idsensor = models.AutoField(primary_key=True)
    nombreusu = models.CharField(max_length=45)
    newrpm = models.IntegerField()
    newoxygen = models.IntegerField()
    lastupdate = models.DateTimeField()

class LecturasSensor(models.Model):
    idlectura = models.AutoField(primary_key=True)
    nombreusu = models.CharField(max_length=45)
    pulso = models.PositiveSmallIntegerField()
    oxigeno = models.PositiveSmallIntegerField()
    estado = models.CharField(max_length=20)
    fecha = models.DateTimeField()