from rest_framework import serializers
from .models import Doctor, Hospital, Production, Transfer


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'


class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'


class ProductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Production
        fields = '__all__'


class TransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transfer
        fields = '__all__'


class FinancialSummarySerializer(serializers.Serializer):
    total_produced = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_transferred = serializers.DecimalField(
        max_digits=12, decimal_places=2)
    balance = serializers.DecimalField(max_digits=12, decimal_places=2)
