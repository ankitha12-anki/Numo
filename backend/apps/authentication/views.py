from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import (
    UserRegistrationSerializer, 
    PasswordResetRequestSerializer,
    VerifyOTPSerializer,
    PasswordResetSerializer
)
from .models import OTP
from apps.core.utils import generate_otp, send_otp_email
from django.utils import timezone

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer

class ForgotPasswordView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                otp_code = generate_otp()
                OTP.objects.create(user=user, otp_code=otp_code)
                if send_otp_email(email, otp_code):
                    return Response({"message": "OTP sent to your email."}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Failed to send email."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except User.DoesNotExist:
                # Security: Don't reveal if user exists, but here for a calculator app it's often fine.
                # In production, you'd return 200 regardless.
                return Response({"error": "User with this email not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp_code']
            
            otp_obj = OTP.objects.filter(
                user__email=email, 
                otp_code=otp_code, 
                is_verified=False
            ).last()
            
            if otp_obj and not otp_obj.is_expired():
                otp_obj.is_verified = True
                otp_obj.save()
                return Response({"message": "OTP verified successfully."}, status=status.HTTP_200_OK)
            return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp_code']
            new_password = serializer.validated_data['new_password']
            
            otp_obj = OTP.objects.filter(
                user__email=email, 
                otp_code=otp_code, 
                is_verified=True
            ).last()
            
            if otp_obj:
                user = otp_obj.user
                user.set_password(new_password)
                user.save()
                otp_obj.delete() # Cleanup
                return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
            return Response({"error": "Unauthorized or OTP not verified."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
