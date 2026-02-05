from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_superuser": user.is_superuser
        })


class AdminTestView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({"message": "Você é superusuário e pode acessar!"})
