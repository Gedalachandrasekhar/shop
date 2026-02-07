from rest_framework import serializers
from .models import Complaint, ComplaintPart
from inventory.models import InventoryItem

class ComplaintPartSerializer(serializers.ModelSerializer):
    part_name = serializers.ReadOnlyField(source='part.name')

    class Meta:
        model = ComplaintPart
        fields = ['id', 'part', 'part_name', 'quantity_used']

class ComplaintSerializer(serializers.ModelSerializer):
    parts_used = ComplaintPartSerializer(many=True, read_only=True)
    customer_phone = serializers.ReadOnlyField(source='customer.phone')
    assigned_employee_name = serializers.ReadOnlyField(source='assigned_employee.first_name')

    class Meta:
        model = Complaint
        fields = '__all__'
        read_only_fields = ['ticket_id', 'created_at', 'customer']

    def create(self, validated_data):
        # Automatically assign the logged-in user as the customer
        validated_data['customer'] = self.context['request'].user
        return super().create(validated_data)