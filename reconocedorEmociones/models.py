from django.db import models
from django.conf import settings

class EmocionesUsuario(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    felicidad = models.FloatField(default=0)
    tristeza = models.FloatField(default=0)
    enojo = models.FloatField(default=0)
    sorpresa = models.FloatField(default=0)
    neutral = models.FloatField(default=0)
    nombre_video = models.CharField(max_length=255, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    comentario = models.TextField(blank=True, null=True)  # Nuevo campo para almacenar el comentario

    def __str__(self):
        return f"Emociones de {self.usuario.username} - {self.fecha_creacion} - Video: {self.nombre_video}"

