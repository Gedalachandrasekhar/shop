from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import (
    RegisterSerializer, 
    CustomTokenObtainPairSerializer, 
    UserSerializer
)

User = get_user_model()

# 1. Registration (Sign Up)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

# 2. Custom Login (Returns Token + Role)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# 3. User Profile (Get Current User Info)
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# 4. List Employees (For Admin/Manager)
class EmployeeListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only staff roles
        return User.objects.filter(role__in=['TECHNICIAN', 'EMPLOYEE', 'MANAGER', 'ADMIN'])

# 5. Add New Employee (For Admin/Manager)
class EmployeeCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.IsAuthenticated] # Should be IsAdminUser ideally

    def perform_create(self, serializer):
        # When an Admin creates a user, we allow setting the role via the API
        # (Note: You might need to update RegisterSerializer to allow 'role' input if passed by Admin)
        # For now, we default to EMPLOYEE if not specified
        serializer.save(role='EMPLOYEE') 

# 6. Delete Employee
class EmployeeDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAdminUser]