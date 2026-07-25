from django.urls import path
from .views import (
    CustomerView, HallView, BookingView, ActivityLogView,
    DashboardStatsView, RevenueReportView, CustomerReportView,
    PaymentView, HallPricingView, BookingServiceView, HallAmenityView,
)

urlpatterns = [
    path('v1/customer/', CustomerView.as_view(), name='customer'),
    path('v1/hall/', HallView.as_view(), name='hall'),
    path('v1/booking/', BookingView.as_view(), name='booking'),
    path('v1/activity/log/', ActivityLogView.as_view(), name='activity-log'),

    path('v1/dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('v1/reports/revenue/', RevenueReportView.as_view(), name='revenue-report'),
    path('v1/reports/customer/', CustomerReportView.as_view(), name='customer-report'),

    path('v1/payment/', PaymentView.as_view(), name='payment'),
    path('v1/hall/pricing/', HallPricingView.as_view(), name='hall-pricing'),
    path('v1/booking/service/', BookingServiceView.as_view(), name='booking-service'),
    path('v1/hall/amenity/', HallAmenityView.as_view(), name='hall-amenity'),
]