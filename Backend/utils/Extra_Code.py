from django.db import models

# Create your models here.

import uuid
from django.db import models
from django.core.validators import MinValueValidator
from utils.reusable_classes import TimeStamps, TimeUserStamps
from utils.validators import val_name, val_mobile, val_code_name
from utils.enums import *


# ─────────────────────────────────────────────────────────────────────
# CUSTOMERS
# ─────────────────────────────────────────────────────────────────────
class Customer(TimeUserStamps):
    """
    Customers screen: Customer Management table.
    Mirrors the Employee pattern — a profile linked 1:1 to User
    (type=CUSTOMER), holding fields specific to the Customers screen.
    bookings_count / total_spent are denormalized for fast dashboard
    reads, refreshed via recalculate_stats().
    """
    user = models.OneToOneField('User', on_delete=models.SET_NULL, related_name="user_customer", null=True, blank=True)
    name_en = models.CharField(max_length=150, validators=[val_name])
    name_ar = models.CharField(max_length=150, null=True, blank=True)
    mobile = models.CharField(max_length=35, validators=[val_mobile], null=True, blank=True)
    email = models.EmailField(max_length=100, null=True, blank=True)
    bookings_count = models.PositiveIntegerField(default=0)
    total_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return self.name_en

    def recalculate_stats(self):
        agg = self.bookings.aggregate(
            count=models.Count('id'),
            total=models.Sum('total')
        )
        self.bookings_count = agg['count'] or 0
        self.total_spent = agg['total'] or 0
        self.save(update_fields=['bookings_count', 'total_spent'])


# ─────────────────────────────────────────────────────────────────────
# HALLS & VENUES
# ─────────────────────────────────────────────────────────────────────
def get_hall_image_path(self, filename):
    return f'hall_images/{self.pk}/{str(uuid.uuid4())}.png'


class Hall(TimeUserStamps):
    """
    Halls & Venues screen: hall cards (name EN/AR, capacity, badge, status).
    """
    name_en = models.CharField(max_length=150, validators=[val_name])
    name_ar = models.CharField(max_length=150, null=True, blank=True)
    code_name = models.CharField(max_length=50, unique=True, validators=[val_code_name])
    capacity = models.CharField(max_length=50, help_text='Display string, e.g. "700 Guests"')
    capacity_count = models.PositiveIntegerField(null=True, blank=True)
    badge = models.CharField(max_length=100, null=True, blank=True)
    image = models.ImageField(max_length=255, upload_to=get_hall_image_path, null=True, blank=True)

    occupied = models.BooleanField(default=False)
    occupied_dates = models.CharField(max_length=255, null=True, blank=True)
    booking_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name_en

    def save(self, *args, **kwargs):
        self.name_en = self.name_en.title()
        return super().save(*args, **kwargs)

    def recalculate_booking_count(self):
        self.booking_count = self.bookings.count()
        self.save(update_fields=['booking_count'])


# ─────────────────────────────────────────────────────────────────────
# EVENT BOOKINGS
# ─────────────────────────────────────────────────────────────────────
class Booking(TimeUserStamps):
    """
    Event Bookings screen: bookings table + create/update modal.
    Source table for Revenue Report and Customer Report (date-filtered
    queries over this table — see report helper functions below).
    """
    status_choices = (
        (CONFIRMED, CONFIRMED),
        (PENDING, PENDING),
        (CANCELLED, CANCELLED),
    )

    booking_code = models.CharField(max_length=20, unique=True, null=True, blank=True,
                                      help_text='Human-readable ID like "B1001" (auto-generated if blank)')
    hall = models.ForeignKey('Hall', on_delete=models.CASCADE, related_name='bookings')
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE, related_name='bookings')

    type_en = models.CharField(max_length=100, help_text='Event type, e.g. "Wedding"')
    type_ar = models.CharField(max_length=100, null=True, blank=True)

    date = models.DateField()
    status = models.CharField(max_length=20, choices=status_choices, default=PENDING)
    total = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])

    def __str__(self):
        return f"{self.booking_code} - {self.type_en} @ {self.hall.name_en}"

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        if is_new and not self.booking_code:
            self.booking_code = f"B{1000 + self.id}"
            super().save(update_fields=['booking_code'])


# ─────────────────────────────────────────────────────────────────────
# ACTIVITY LOG
# ─────────────────────────────────────────────────────────────────────
class ActivityLog(TimeStamps):
    """
    Dashboard 'Recent Activity' feed.
    Populate via signals on Booking/Customer/Hall create/update/delete.
    """
    icon = models.CharField(max_length=10, default='🔔')
    text = models.CharField(max_length=255)
    user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='activity_logs')

    def __str__(self):
        return self.text


# ─────────────────────────────────────────────────────────────────────
# REVENUE REPORT & CUSTOMER REPORT
# ─────────────────────────────────────────────────────────────────────
# Not separate tables — both reports on the Reports & Analytics screen
# are generated by filtering Booking by date range. Use these helpers
# from a view/serializer; they return querysets ready for export.

def revenue_report(start_date=None, end_date=None):
    """
    Revenue Report: Booking ID, Hall, Customer, Date, Status, Total.
    """
    qs = Booking.objects.select_related('hall', 'customer')
    if start_date:
        qs = qs.filter(date__gte=start_date)
    if end_date:
        qs = qs.filter(date__lte=end_date)
    return qs.values(
        'booking_code', 'hall__name_en', 'customer__name_en',
        'date', 'status', 'total'
    )


def customer_report(start_date=None, end_date=None):
    """
    Customer Report: Customer Name, Bookings in Period.
    """
    qs = Booking.objects.select_related('customer')
    if start_date:
        qs = qs.filter(date__gte=start_date)
    if end_date:
        qs = qs.filter(date__lte=end_date)
    return (
        qs.values('customer__name_en')
          .annotate(bookings_in_period=models.Count('id'))
          .order_by('-bookings_in_period')
    )