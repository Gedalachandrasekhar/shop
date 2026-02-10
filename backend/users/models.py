from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('CUSTOMER', 'Customer'),
        ('TECHNICIAN', 'Technician'),
        ('EMPLOYEE', 'Employee'),
        ('MANAGER', 'Manager'),
        ('ADMIN', 'Admin'),
    ]

    # key fields required by your serializer
    phone = models.CharField(max_length=15, unique=True)
    address = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CUSTOMER')

    # We use phone as the login identifier instead of username
    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['username', 'email'] # 'username' is still required by AbstractUser under the hood

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"