import django_filters as filters
from django.db.models import Q
from .models import Customer, Hall, Booking, ActivityLog, Payment, HallPricing, BookingService, HallAmenity


class CustomerFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    date_to = filters.DateFilter(field_name='created_at', lookup_expr='lte')
    date_from = filters.DateFilter(field_name='created_at', lookup_expr='gte')

    class Meta:
        model = Customer
        fields = ['created_at']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name_en__icontains=value) |
            Q(name_ar__icontains=value) |
            Q(mobile__icontains=value) |
            Q(email__icontains=value)
        )


class HallFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    occupied = filters.BooleanFilter(field_name='occupied')
    date_to = filters.DateFilter(field_name='created_at', lookup_expr='lte')
    date_from = filters.DateFilter(field_name='created_at', lookup_expr='gte')

    class Meta:
        model = Hall
        fields = ['occupied', 'created_at']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name_en__icontains=value) |
            Q(name_ar__icontains=value) |
            Q(code_name__icontains=value) |
            Q(badge__icontains=value)
        )


class BookingFilter(filters.FilterSet):
    search    = filters.CharFilter(method='filter_search')
    status    = filters.CharFilter(field_name='status',    lookup_expr='iexact')
    time_slot = filters.CharFilter(field_name='time_slot', lookup_expr='iexact')  # ← NEW
    hall      = filters.NumberFilter(field_name='hall_id')
    customer  = filters.NumberFilter(field_name='customer_id')
    date_to   = filters.DateFilter(field_name='date', lookup_expr='lte')
    date_from = filters.DateFilter(field_name='date', lookup_expr='gte')

    class Meta:
        model  = Booking
        fields = ['status', 'time_slot', 'hall', 'customer', 'date']  # ← NEW

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(booking_code__icontains=value)     |
            Q(event_type_en__icontains=value)    |
            Q(event_type_ar__icontains=value)    |
            Q(hall__name_en__icontains=value)    |
            Q(customer__name_en__icontains=value)
        )

class ActivityLogFilter(filters.FilterSet):
    date_to = filters.DateFilter(field_name='created_at', lookup_expr='lte')
    date_from = filters.DateFilter(field_name='created_at', lookup_expr='gte')

    class Meta:
        model = ActivityLog
        fields = ['created_at']


class PaymentFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    booking = filters.NumberFilter(field_name='booking_id')
    payment_method = filters.CharFilter(field_name='payment_method', lookup_expr='iexact')
    date_to = filters.DateFilter(field_name='payment_date', lookup_expr='lte')
    date_from = filters.DateFilter(field_name='payment_date', lookup_expr='gte')

    class Meta:
        model = Payment
        fields = ['booking', 'payment_method', 'payment_date']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(booking__booking_code__icontains=value) |
            Q(notes__icontains=value)
        )


class HallPricingFilter(filters.FilterSet):
    hall = filters.NumberFilter(field_name='hall_id')
    time_slot = filters.CharFilter(field_name='time_slot', lookup_expr='iexact')
    date_to = filters.DateFilter(field_name='valid_from', lookup_expr='lte')
    date_from = filters.DateFilter(field_name='valid_from', lookup_expr='gte')

    class Meta:
        model = HallPricing
        fields = ['hall', 'time_slot', 'valid_from']


class BookingServiceFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    booking = filters.NumberFilter(field_name='booking_id')
    date_to = filters.DateFilter(field_name='created_at', lookup_expr='lte')
    date_from = filters.DateFilter(field_name='created_at', lookup_expr='gte')

    class Meta:
        model = BookingService
        fields = ['booking', 'created_at']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(service_name_en__icontains=value) |
            Q(service_name_ar__icontains=value) |
            Q(notes__icontains=value)
        )


class HallAmenityFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    hall = filters.NumberFilter(field_name='hall_id')
    date_to = filters.DateFilter(field_name='created_at', lookup_expr='lte')
    date_from = filters.DateFilter(field_name='created_at', lookup_expr='gte')

    class Meta:
        model = HallAmenity
        fields = ['hall', 'created_at']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name_en__icontains=value) |
            Q(name_ar__icontains=value) |
            Q(description_en__icontains=value) |
            Q(description_ar__icontains=value)
        )