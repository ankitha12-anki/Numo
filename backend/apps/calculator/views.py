from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .logic import CalculatorLogic

class CalculateView(APIView):
    # Allow non-authenticated users to use the calculator too?
    # Requirement said "Scientific calculation API". 
    # History requires auth. Calculation itself can be public or private.
    # I'll make it public but history will be private.
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        expression = request.data.get('expression')
        if not expression:
            return Response({"error": "Expression is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        calc = CalculatorLogic()
        try:
            result = calc.evaluate(expression)
            return Response({"result": result}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
