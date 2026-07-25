# import uuid
# from django.db import models
# from django.core.validators import MinValueValidator
# from config import settings
# from utils.reusable_classes import TimeStamps, TimeUserStamps
# from utils.validators import val_name, val_mobile, val_code_name
# from utils.enums import *


# # ─────────────────────────────────────────────────────────────────────
# # CUSTOMERS
# # ─────────────────────────────────────────────────────────────────────
# class Customer(TimeUserStamps):
#     """
#     Customers screen: Customer Management table.

#     This is a plain contact/profile record managed entirely by staff
#     (admin, data-entry, manager, CEO) — customers do NOT have login
#     accounts. created_by / updated_by (from TimeUserStamps) already
#     point to the staff User who created/edited this record, so no
#     separate `user` FK is needed here.

#     bookings_count / total_spent are denormalized for fast dashboard
#     reads, refreshed via recalculate_stats().
#     """
#     name_en = models.CharField(max_length=150, validators=[val_name])
#     name_ar = models.CharField(max_length=150, null=True, blank=True)
#     mobile = models.CharField(max_length=35, validators=[val_mobile], null=True, blank=True)
#     email = models.EmailField(max_length=100, null=True, blank=True)
#     bookings_count = models.PositiveIntegerField(default=0)
#     total_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0)

#     def __str__(self):
#         return self.name_en

#     def recalculate_stats(self):
#         agg = self.bookings.aggregate(
#             count=models.Count('id'),
#             total=models.Sum('total')
#         )
#         self.bookings_count = agg['count'] or 0
#         self.total_spent = agg['total'] or 0
#         self.save(update_fields=['bookings_count', 'total_spent'])


# # ─────────────────────────────────────────────────────────────────────
# # HALLS & VENUES
# # ─────────────────────────────────────────────────────────────────────
# def get_hall_image_path(self, filename):
#     return f'hall_images/{self.pk}/{str(uuid.uuid4())}.png'


# class Hall(TimeUserStamps):
#     """
#     Halls & Venues screen: hall cards (name EN/AR, capacity, badge, status).
#     """
#     name_en = models.CharField(max_length=150, validators=[val_name])
#     name_ar = models.CharField(max_length=150, null=True, blank=True)
#     code_name = models.CharField(max_length=50, unique=True, validators=[val_code_name])
#     capacity = models.CharField(max_length=50, help_text='Display string, e.g. "700 Guests"')
#     capacity_count = models.PositiveIntegerField(null=True, blank=True)
#     badge = models.CharField(max_length=100, null=True, blank=True)
#     image = models.ImageField(max_length=255, upload_to=get_hall_image_path, null=True, blank=True)

#     occupied = models.BooleanField(default=False)
#     occupied_dates = models.CharField(max_length=255, null=True, blank=True)
#     booking_count = models.PositiveIntegerField(default=0)

#     def __str__(self):
#         return self.name_en

#     def save(self, *args, **kwargs):
#         self.name_en = self.name_en.title()
#         return super().save(*args, **kwargs)

#     def recalculate_booking_count(self):
#         self.booking_count = self.bookings.count()
#         self.save(update_fields=['booking_count'])


# # ─────────────────────────────────────────────────────────────────────
# # EVENT BOOKINGS
# # ─────────────────────────────────────────────────────────────────────
# class Booking(TimeUserStamps):
#     # ── Time slot choices ──────────────────────────────────────────
#     TIME_SLOT_MORNING   = 'morning'
#     TIME_SLOT_AFTERNOON = 'afternoon'
#     TIME_SLOT_NIGHT     = 'night'

#     TIME_SLOT_CHOICES = (
#         (TIME_SLOT_MORNING,   'Morning Shift'),
#         (TIME_SLOT_AFTERNOON, 'Afternoon Shift'),
#         (TIME_SLOT_NIGHT,     'Night Shift'),
#     )

#     status_choices = (
#         (CONFIRMED, CONFIRMED),
#         (PENDING,   PENDING),
#         (CANCELLED, CANCELLED),
#     )

#     booking_code   = models.CharField(max_length=20, unique=True, null=True, blank=True,
#                                       help_text='Human-readable ID like "B1001" (auto-generated if blank)')
#     hall           = models.ForeignKey('Hall',     on_delete=models.CASCADE, related_name='bookings')
#     customer       = models.ForeignKey('Customer', on_delete=models.CASCADE, related_name='bookings')

#     event_type_en  = models.CharField(max_length=100, help_text='Event type, e.g. "Wedding"')
#     event_type_ar  = models.CharField(max_length=100, null=True, blank=True)

#     date           = models.DateField()
#     time_slot      = models.CharField(          # ← NEW
#         max_length=20,
#         choices=TIME_SLOT_CHOICES,
#         default=TIME_SLOT_MORNING,
#         help_text='Event time slot: Morning Shift, Afternoon Shift, or Night Shift',
#     )
#     status         = models.CharField(max_length=20, choices=status_choices, default=PENDING)
#     total          = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])

#     def __str__(self):
#         return f"{self.booking_code} - {self.event_type_en} @ {self.hall.name_en}"

#     def save(self, *args, **kwargs):
#         is_new = self._state.adding
#         super().save(*args, **kwargs)
#         if is_new and not self.booking_code:
#             self.booking_code = f"B{1000 + self.id}"
#             super().save(update_fields=['booking_code'])

# # ─────────────────────────────────────────────────────────────────────
# # ACTIVITY LOG
# # ─────────────────────────────────────────────────────────────────────
# class ActivityLog(TimeStamps):
#     """
#     Dashboard 'Recent Activity' feed.
#     Populate via signals on Booking/Customer/Hall create/update/delete.
#     """
#     icon = models.CharField(max_length=10, default='🔔')
#     text = models.CharField(max_length=255)
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='activity_logs')

#     def __str__(self):
#         return self.text


# # ─────────────────────────────────────────────────────────────────────
# # REVENUE REPORT & CUSTOMER REPORT
# # ─────────────────────────────────────────────────────────────────────
# # Not separate tables — both reports on the Reports & Analytics screen
# # are generated by filtering Booking by date range. Use these helpers
# # from a view/serializer; they return querysets ready for export.

# def revenue_report(start_date=None, end_date=None):
#     """
#     Revenue Report: Booking ID, Hall, Customer, Date, Status, Total.
#     """
#     qs = Booking.objects.select_related('hall', 'customer')
#     if start_date:
#         qs = qs.filter(date__gte=start_date)
#     if end_date:
#         qs = qs.filter(date__lte=end_date)
#     return qs.values(
#         'booking_code', 'hall__name_en', 'customer__name_en',
#         'date', 'status', 'total'
#     )


# def customer_report(start_date=None, end_date=None):
#     """
#     Customer Report: Customer Name, Bookings in Period.
#     """
#     qs = Booking.objects.select_related('customer')
#     if start_date:
#         qs = qs.filter(date__gte=start_date)
#     if end_date:
#         qs = qs.filter(date__lte=end_date)
#     return (
#         qs.values('customer__name_en')
#           .annotate(bookings_in_period=models.Count('id'))
#           .order_by('-bookings_in_period')
#     )



import uuid
from django.db import models
from django.core.validators import MinValueValidator
from config import settings
from utils.reusable_classes import TimeStamps, TimeUserStamps
from utils.validators import val_name, val_mobile, val_code_name
from utils.enums import *
from django.utils import timezone 

# ─────────────────────────────────────────────────────────────────────
# CUSTOMERS
# ─────────────────────────────────────────────────────────────────────
class Customer(TimeUserStamps):
    """
    Customers screen: Customer Management table.

    This is a plain contact/profile record managed entirely by staff
    (admin, data-entry, manager, CEO) — customers do NOT have login
    accounts. created_by / updated_by (from TimeUserStamps) already
    point to the staff User who created/edited this record, so no
    separate `user` FK is needed here.

    bookings_count / total_spent are denormalized for fast dashboard
    reads, refreshed via recalculate_stats().
    """
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

    def get_upcoming_bookings(self, limit=2):
        """Non-cancelled bookings for today or later, soonest first."""
        today = timezone.localdate()
        return (
            self.bookings
            .filter(deleted=False, date__gte=today)
            .exclude(status=CANCELLED)
            .order_by('date', 'time_slot')[:limit]
        )

    @property
    def is_occupied_today(self):
        today = timezone.localdate()
        return (
            self.bookings
            .filter(deleted=False, date=today)
            .exclude(status=CANCELLED)
            .exists()
        )


# ─────────────────────────────────────────────────────────────────────
# EVENT BOOKINGS
# ─────────────────────────────────────────────────────────────────────
class Booking(TimeUserStamps):
    # ── Time slot choices ──────────────────────────────────────────
    TIME_SLOT_MORNING   = 'morning'
    TIME_SLOT_AFTERNOON = 'afternoon'
    TIME_SLOT_NIGHT     = 'night'

    TIME_SLOT_CHOICES = (
        (TIME_SLOT_MORNING,   'Morning Shift'),
        (TIME_SLOT_AFTERNOON, 'Afternoon Shift'),
        (TIME_SLOT_NIGHT,     'Night Shift'),
    )

    status_choices = (
        (CONFIRMED, CONFIRMED),
        (PENDING,   PENDING),
        (CANCELLED, CANCELLED),
    )

    booking_code   = models.CharField(max_length=20, unique=True, null=True, blank=True,
                                      help_text='Human-readable ID like "B1001" (auto-generated if blank)')
    hall           = models.ForeignKey('Hall',     on_delete=models.CASCADE, related_name='bookings')
    customer       = models.ForeignKey('Customer', on_delete=models.CASCADE, related_name='bookings')

    event_type_en  = models.CharField(max_length=100, help_text='Event type, e.g. "Wedding"')
    event_type_ar  = models.CharField(max_length=100, null=True, blank=True)

    date           = models.DateField()
    time_slot      = models.CharField(          # ← NEW
                                max_length=20,
                                choices=TIME_SLOT_CHOICES,
                                default=TIME_SLOT_MORNING,
                                help_text='Event time slot: Morning Shift, Afternoon Shift, or Night Shift',
    )
    status         = models.CharField(max_length=20, choices=status_choices, default=PENDING)
    total          = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])

    def __str__(self):
        return f"{self.booking_code} - {self.event_type_en} @ {self.hall.name_en}"

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
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='activity_logs')

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


# ─────────────────────────────────────────────────────────────────────
# PAYMENTS
# ─────────────────────────────────────────────────────────────────────
class Payment(TimeUserStamps):
    """
    Payments screen: Payment records for bookings.
    Tracks partial and full payments for each booking.
    """
    PAYMENT_METHOD_CASH = 'cash'
    PAYMENT_METHOD_CARD = 'card'
    PAYMENT_METHOD_BANK_TRANSFER = 'bank_transfer'
    PAYMENT_METHOD_CHECK = 'check'

    PAYMENT_METHOD_CHOICES = (
        (PAYMENT_METHOD_CASH, 'Cash'),
        (PAYMENT_METHOD_CARD, 'Card'),
        (PAYMENT_METHOD_BANK_TRANSFER, 'Bank Transfer'),
        (PAYMENT_METHOD_CHECK, 'Check'),
    )

    booking = models.ForeignKey('Booking', on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES)
    payment_date = models.DateField()
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.booking.booking_code} - {self.amount} ({self.payment_method})"


# ─────────────────────────────────────────────────────────────────────
# HALL PRICING
# ─────────────────────────────────────────────────────────────────────
class HallPricing(TimeUserStamps):
    """
    Hall Pricing screen: Price management for halls by time slot.
    Allows dynamic pricing based on time slots and date ranges.
    """
    hall = models.ForeignKey('Hall', on_delete=models.CASCADE, related_name='pricing')
    time_slot = models.CharField(
        max_length=20,
        choices=Booking.TIME_SLOT_CHOICES,
        help_text='Time slot: Morning Shift, Afternoon Shift, or Night Shift'
    )
    base_price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    valid_from = models.DateField()
    valid_until = models.DateField(null=True, blank=True, help_text='Leave blank for no end date')

    def __str__(self):
        return f"{self.hall.name_en} - {self.get_time_slot_display()} - {self.base_price}"

    class Meta:
        unique_together = ['hall', 'time_slot', 'valid_from']


# ─────────────────────────────────────────────────────────────────────
# BOOKING SERVICES
# ─────────────────────────────────────────────────────────────────────
class BookingService(TimeUserStamps):
    """
    Booking Services screen: Additional services/add-ons for bookings.
    Examples: Catering, Decoration, Photography, etc.
    """
    booking = models.ForeignKey('Booking', on_delete=models.CASCADE, related_name='services')
    service_name_en = models.CharField(max_length=100, validators=[val_name])
    service_name_ar = models.CharField(max_length=100, null=True, blank=True)
    cost = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.service_name_en} - {self.cost}"


# ─────────────────────────────────────────────────────────────────────
# HALL AMENITIES
# ─────────────────────────────────────────────────────────────────────
class HallAmenity(TimeUserStamps):
    """
    Hall Amenities screen: Amenities available in each hall.
    Examples: WiFi, Parking, AC, Projector, Sound System, etc.
    """
    hall = models.ForeignKey('Hall', on_delete=models.CASCADE, related_name='amenities')
    name_en = models.CharField(max_length=100, validators=[val_name])
    name_ar = models.CharField(max_length=100, null=True, blank=True)
    description_en = models.TextField(null=True, blank=True)
    description_ar = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.hall.name_en} - {self.name_en}"