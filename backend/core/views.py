from django.db.models import Sum
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Doctor, Hospital, Production, Transfer
# No core/views.py
from .serializers import (
    DoctorSerializer, HospitalSerializer,
    ProductionSerializer, TransferSerializer
)


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'], url_path='financial-summary')
    def financial_summary(self, request, pk=None):
        doctor = self.get_object()
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        productions = doctor.productions.all()
        transfers = doctor.transfers.all()

        if start_date:
            productions = productions.filter(production_date__gte=start_date)
            transfers = transfers.filter(transfer_date__gte=start_date)
        if end_date:
            productions = productions.filter(production_date__lte=end_date)
            transfers = transfers.filter(transfer_date__lte=end_date)

        total_produced = productions.aggregate(
            Sum('amount'))['amount__sum'] or 0
        total_transferred = transfers.aggregate(
            Sum('amount'))['amount__sum'] or 0

        data = {
            'total_produced': total_produced,
            'total_transferred': total_transferred,
            'balance': total_produced - total_transferred
        }
        return Response(data)


class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
    permission_classes = [IsAuthenticated]


class ProductionViewSet(viewsets.ModelViewSet):
    queryset = Production.objects.all()
    serializer_class = ProductionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Production.objects.all()
        doctor = self.request.query_params.get('doctor')
        hospital = self.request.query_params.get('hospital')
        if doctor:
            queryset = queryset.filter(doctor_id=doctor)
        if hospital:
            queryset = queryset.filter(hospital_id=hospital)
        return queryset


class TransferViewSet(viewsets.ModelViewSet):
    queryset = Transfer.objects.all()
    serializer_class = TransferSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Transfer.objects.all()
        doctor = self.request.query_params.get('doctor')
        if doctor:
            queryset = queryset.filter(doctor_id=doctor)
        return queryset
