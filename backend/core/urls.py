from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # --- Authentication Endpoints (JWT) ---
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Refresh Token

    # --- App Endpoints ---
    # These connect your apps to the API URL
    path('api/users/', include('users.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/complaints/', include('complaints.urls')),
    path('api/attendance/', include('attendance.urls')),
]