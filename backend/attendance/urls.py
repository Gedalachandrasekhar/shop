from django.urls import path
from .views import MarkAttendanceView, TimesheetView

urlpatterns = [
    path('mark/', MarkAttendanceView.as_view(), name='mark_attendance'),
    path('timesheet/', TimesheetView.as_view(), name='timesheet'),
]