from rest_framework import serializers
from .models import Complaint, ComplaintPart
from django.contrib.auth import get_user_model

User = get_user_model()

class ComplaintPartSerializer(serializers.ModelSerializer):
    part_name = serializers.ReadOnlyField(source='part.name')

    class Meta:
        model = ComplaintPart
        fields = ['id', 'part', 'part_name', 'quantity_used']

class ComplaintSerializer(serializers.ModelSerializer):
    parts_used = ComplaintPartSerializer(many=True, read_only=True)

    # We REMOVED the 'source=' lines for name/phone so they write to the
    # Complaint table, not just read from the User table.

    assigned_employee_name = serializers.ReadOnlyField(source='assigned_employee.first_name')

    class Meta:
        model = Complaint
        fields = '__all__'
        # Ensure 'customer_name' and 'customer_phone' are NOT in this list:
        read_only_fields = ['ticket_id', 'created_at', 'customer']

    def create(self, validated_data):
        # We handle customer assignment in the View, so we pass
        return super().create(validated_data)