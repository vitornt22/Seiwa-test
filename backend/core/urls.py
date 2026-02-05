from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet, HospitalViewSet, ProductionViewSet, TransferViewSet

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet, basename='doctor')
router.register(r'hospitals', HospitalViewSet, basename='hospital')
router.register(r'productions', ProductionViewSet, basename='production')
router.register(r'transfers', TransferViewSet, basename='transfer')

urlpatterns = [
    path('', include(router.urls)),
]
