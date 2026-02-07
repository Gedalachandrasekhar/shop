from rest_framework import permissions

class IsAdminOrManagerOrReadOnly(permissions.BasePermission):
    """
    Custom permission:
    - Unauthenticated (Guest): NO ACCESS
    - Customer: NO ACCESS (per your requirement)
    - Technician/Employee: READ ONLY (can view stock)
    - Admin/Manager: FULL ACCESS (can add/edit stock)
    """
    def has_permission(self, request, view):
        # 1. Check if user is logged in first.
        # If they are not logged in, 'request.user' is AnonymousUser, which causes the crash.
        if not request.user or not request.user.is_authenticated:
            return False

        # 2. Define who can READ (GET requests)
        # Only Staff (Technicians, Managers, Admins) can view inventory. Customers cannot.
        if request.method in permissions.SAFE_METHODS:
            return request.user.role in ['TECHNICIAN', 'EMPLOYEE', 'MANAGER', 'ADMIN']

        # 3. Define who can WRITE (POST, PUT, DELETE requests)
        # Only Managers and Admins can change inventory.
        return request.user.role in ['MANAGER', 'ADMIN']