from rest_framework import viewsets, filters
from .models import InventoryItem
from .serializers import InventoryItemSerializer
from .permissions import IsAdminOrManagerOrReadOnly

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all().order_by('name')
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAdminOrManagerOrReadOnly]
    
    # Add search capability
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'sku', 'category']