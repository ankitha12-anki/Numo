from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CalculationHistory
from .serializers import CalculationHistorySerializer

class HistoryView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        history = CalculationHistory.objects.filter(user=request.user)
        serializer = CalculationHistorySerializer(history, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CalculationHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        # Optional: delete specific record if ID is provided, otherwise clear all
        record_id = request.query_params.get('id')
        if record_id:
            try:
                record = CalculationHistory.objects.get(id=record_id, user=request.user)
                record.delete()
                return Response({"message": "Record deleted."}, status=status.HTTP_204_NO_CONTENT)
            except CalculationHistory.DoesNotExist:
                return Response({"error": "Record not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            CalculationHistory.objects.filter(user=request.user).delete()
            return Response({"message": "History cleared."}, status=status.HTTP_204_NO_CONTENT)
