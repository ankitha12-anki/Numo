import random
import string
from django.core.mail import send_mail
from django.conf import settings

def generate_otp(length=6):
    """Generate a random numeric OTP."""
    return ''.join(random.choices(string.digits, k=length))

def send_otp_email(email, otp):
    """Send OTP to user's email."""
    subject = 'Your Numo Calculator OTP'
    message = f'Your OTP for password reset is: {otp}. It is valid for 5 minutes.'
    email_from = settings.DEFAULT_FROM_EMAIL
    recipient_list = [email]
    
    try:
        send_mail(subject, message, email_from, recipient_list)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
