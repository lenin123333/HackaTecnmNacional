from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from .models import DatosPersonales
from django.contrib import messages
from .forms import RegistroForm
from django.contrib.auth import authenticate, login,logout



def loguear(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
       

        if not username or not password:
            messages.error(request, 'Debes ingresar tanto el nombre de usuario como la contraseña.')
        else:
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                
               
                
                messages.success(request, 'Inicio de sesión exitoso.')
                return redirect('Inicio')
            else:
                messages.error(request, 'Credenciales incorrectas. Inténtalo de nuevo.')

    return render(request, 'autenticacion/login.html')



def cerrar_sesion(request):
    logout(request)
    return redirect('Home')





def register(request):
    if request.method == 'POST':
        form = RegistroForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            nombre = form.cleaned_data['nombre']
            apellido = form.cleaned_data['apellido']
            numero_telefono = form.cleaned_data['numero_telefono']
            correo_electronico = form.cleaned_data['correo_electronico']

            # Verificar si el nombre de usuario ya existe
            if User.objects.filter(username=username).exists():
                form.add_error('username', 'El nombre de usuario ya existe. Por favor, elige otro nombre de usuario.')
                return render(request, 'autenticacion/registro.html', {'form': form})

            # Verificar si el correo electrónico ya existe
            if User.objects.filter(email=correo_electronico).exists():
                form.add_error('correo_electronico', 'El correo electrónico ya está registrado. Por favor, utiliza otro correo.')
                return render(request, 'autenticacion/registro.html', {'form': form})

            # Si no hay duplicados, crea el nuevo usuario y guarda los datos personales
            user = User.objects.create_user(username=username, password=password, email=correo_electronico)

            datos_personales = DatosPersonales(
                nombre=nombre,
                apellido=apellido,
                numero_telefono=numero_telefono,
                user=user
            )

            datos_personales.save()
            login(request, user)
            

            return redirect('Inicio')
    else:
        form = RegistroForm()

    return render(request, 'autenticacion/registro.html', {'form': form})
