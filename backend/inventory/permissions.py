from rest_framework import permissions

class IsAdminOrManagerOrReadOnly(permissions.BasePermission):
    """
    - Unauthenticated: NO ACCESS
    - Customer: NO ACCESS
    - Technician: READ ONLY
    - Admin/Manager: FULL ACCESS
    """
    def has_permission(self, request, view):
        # 1. Check if user is logged in
        if not request.user or not request.user.is_authenticated:
            return False

        # 2. Check for Admin/Manager (Full Access)
        # We check is_staff (Superuser) OR is_manager
        if request.user.is_staff or getattr(request.user, 'is_manager', False):
            return True

        # 3. Check for Technician (Read Only)
        if request.method in permissions.SAFE_METHODS: # GET, HEAD, OPTIONS
            return getattr(request.user, 'is_technician', False)

        # Everyone else (Customers) -> False
        return False