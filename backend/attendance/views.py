from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Attendance
from .serializers import AttendanceSerializer

# 1. View to Mark Attendance (Clock In)
class MarkAttendanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        today = timezone.now().date()
        
        # Check if already marked for today
        if Attendance.objects.filter(user=request.user, date=today).exists():
            return Response({"message": "Attendance already marked for today!"}, status=status.HTTP_400_BAD_REQUEST)

        # Create attendance record
        attendance = Attendance.objects.create(
            user=request.user,
            status='Present',
            clock_in=timezone.now().time()
        )
        return Response(AttendanceSerializer(attendance).data, status=status.HTTP_201_CREATED)

# 2. View to See Timesheet (History)
class TimesheetView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users see only their own attendance; Admin/Managers see all
        user = self.request.user
        if user.is_staff or getattr(user, 'is_manager', False):
            return Attendance.objects.all().order_by('-date')
        return Attendance.objects.filter(user=user).order_by('-date')