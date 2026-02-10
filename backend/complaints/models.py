from django.db import models
from django.conf import settings
# FIX: Import 'InventoryItem' instead of 'Item'
from inventory.models import InventoryItem 

class Complaint(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved'),
        ('Closed', 'Closed'),
    ]

    ticket_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='complaints')
    
    # For Walk-ins (or if customer profile is incomplete)
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=15)
    
    issue_description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    
    assigned_employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_complaints')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Ticket #{self.ticket_id} - {self.customer_name}"

class ComplaintPart(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='parts_used')
    # FIX: Use 'InventoryItem' here too
    part = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    quantity_used = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.part.name} ({self.quantity_used}) for Ticket #{self.complaint.ticket_id}"