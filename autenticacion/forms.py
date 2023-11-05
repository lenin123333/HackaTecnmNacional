from django import forms

class RegistroForm(forms.Form):
    username = forms.CharField(max_length=30)
    password = forms.CharField(widget=forms.PasswordInput)
    nombre = forms.CharField(max_length=30)
    apellido = forms.CharField(max_length=30)
    numero_telefono = forms.CharField(max_length=10)
    correo_electronico = forms.EmailField(max_length=254) # Agregamos un campo de correo electrónico

