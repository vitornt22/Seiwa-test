import uuid
from django.db import models


class Doctor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    crm = models.CharField(max_length=50, unique=True)
    specialty = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Hospital(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Production(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name='productions')
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    production_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)


class Transfer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name='transfers')
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transfer_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
