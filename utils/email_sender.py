import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailSender:
    def __init__(self, email='lenin123333@gmail.com', password='jpbesnwaxqxmryfd'):
        self.email = email
        self.password = password

    def send_email(self, to_email, subject, body):
        # Configuración del servidor SMTP (en este caso, para Gmail)
        smtp_server = 'smtp.gmail.com'
        smtp_port = 587

        # Crear el objeto MIMEText
        message = MIMEMultipart()
        message['From'] = self.email
        message['To'] = to_email
        message['Subject'] = subject
        message.attach(MIMEText(body, 'plain'))

        try:
            # Establecer conexión con el servidor SMTP
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            
            # Iniciar sesión con las credenciales del remitente
            server.login(self.email, self.password)

            # Enviar el correo electrónico
            server.sendmail(self.email, to_email, message.as_string())
            
            # Cerrar la conexión con el servidor SMTP
            server.quit()

            print(f"Correo electrónico enviado exitosamente a {to_email}")
            return True
        except Exception as e:
            print(f"Error al enviar el correo electrónico: {e}")
            return False
