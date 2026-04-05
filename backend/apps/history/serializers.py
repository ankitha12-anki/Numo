from rest_framework import serializers
from .models import CalculationHistory

class CalculationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CalculationHistory
        fields = ('id', 'expression', 'result', 'timestamp')
        read_only_fields = ('id', 'timestamp')

    def create(self, validated_data):
        # user will be added by the view
        return super().create(validated_data)
