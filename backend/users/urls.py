from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
# We added 'EmployeeListView' to the imports below
from .views import RegisterView, CustomTokenObtainPairView, UserProfileView, EmployeeListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserProfileView.as_view(), name='user_profile'),

    # --- THIS WAS MISSING ---
    path('employees/', EmployeeListView.as_view(), name='employee_list'),
]