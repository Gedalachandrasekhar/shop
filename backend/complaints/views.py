from rest_framework import generics, permissions
from .models import Complaint
from .serializers import ComplaintSerializer
from django.db.models import Q

class TicketListCreateView(generics.ListCreateAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Admin, Managers, Technicians see ALL tickets
        if user.is_staff or getattr(user, 'is_manager', False) or getattr(user, 'is_technician', False):
            return Complaint.objects.all().order_by('-created_at')
        # Customers see only THEIR tickets
        return Complaint.objects.filter(customer=user).order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user
        # If a Customer creates it, auto-assign their ID
        if not user.is_staff and not getattr(user, 'is_technician', False):
            serializer.save(customer=user)
        else:
            # If Admin/Tech creates it (Walk-in), save as is (customer field remains null/blank)
            serializer.save()

class TicketDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'ticket_id' # Matches urls.py <int:id> but we map it below

    def get_object(self):
        # Map 'id' from URL to 'ticket_id' in Model
        self.kwargs['ticket_id'] = self.kwargs['id']
        return super().get_object()