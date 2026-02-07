from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Used to view user details"""
    class Meta:
        model = User
        fields = ['id', 'phone', 'first_name', 'last_name', 'role', 'address']

class RegisterSerializer(serializers.ModelSerializer):
    """Used for signing up new users"""
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['phone', 'password', 'first_name', 'last_name', 'address', 'role']
        extra_kwargs = {
            'role': {'read_only': True} # Users cannot set their own role via API (default is CUSTOMER)
        }

    def create(self, validated_data):
        # Securely hash the password
        user = User.objects.create_user(
            username=validated_data['phone'], # phone is the username
            phone=validated_data['phone'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            address=validated_data.get('address', '')
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom Login Logic to return Role + Token"""
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra data to the login response
        data['role'] = self.user.role
        data['phone'] = self.user.phone
        data['full_name'] = f"{self.user.first_name} {self.user.last_name}"

        return data