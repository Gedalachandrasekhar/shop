from django.urls import path
from .views import TicketListCreateView, TicketDetailView

urlpatterns = [
    # GET /tickets/ -> Lists all complaints
    # POST /tickets/ -> Creates a new complaint (Walk-in or Online)
    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),

    # GET /tickets/5/ -> View details of ticket #5
    # PATCH /tickets/5/ -> Update ticket #5 (Assign tech, change status)
    path('tickets/<int:id>/', TicketDetailView.as_view(), name='ticket-detail'),
]