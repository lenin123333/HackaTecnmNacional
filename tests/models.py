from django.db import models
from django.conf import settings

class TestResult(models.Model):
    # Campo para el tipo de prueba
    tipoTest = models.CharField(max_length=255)
    
    # Campo para el porcentaje (se guarda como cadena para manejar múltiples porcentajes)
    porcentaje = models.CharField(max_length=255)

    # Campo para el usuario (relacionado con el modelo de usuario predeterminado)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.tipoTest} - {self.usuario.username}"
