from django.contrib import admin
from .models import Complaint, ComplaintPart

class ComplaintPartInline(admin.TabularInline):
    model = ComplaintPart
    extra = 1

class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('ticket_id', 'customer_name', 'status', 'assigned_employee', 'created_at')
    inlines = [ComplaintPartInline]

admin.site.register(Complaint, ComplaintAdmin)