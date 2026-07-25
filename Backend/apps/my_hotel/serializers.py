from rest_framework import serializers
from utils.enums import CANCELLED
from .models import Customer, Hall, Booking, ActivityLog, Payment, HallPricing, BookingService, HallAmenity


# ─────────────────────────────────────────────────────────────────────
# CUSTOMER
# ─────────────────────────────────────────────────────────────────────
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

    def validate(self, attrs):
        email = attrs.get('email', None)
        mobile = attrs.get('mobile', None)

        if self.instance:
            if email and Customer.objects.filter(email__iexact=email, deleted=False).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError('Customer with this email already exists')
            if mobile and Customer.objects.filter(mobile=mobile, deleted=False).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError('Customer with this mobile already exists')
        else:
            if email and Customer.objects.filter(email__iexact=email, deleted=False).exists():
                raise serializers.ValidationError('Customer with this email already exists')
            if mobile and Customer.objects.filter(mobile=mobile, deleted=False).exists():
                raise serializers.ValidationError('Customer with this mobile already exists')
        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = instance.created_by.full_name if instance.created_by else None
        data['updated_by'] = instance.updated_by.full_name if instance.updated_by else None
        return data


class CustomerListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name_en', 'name_ar', 'mobile', 'email', 'bookings_count', 'total_spent', 'created_at']


# ─────────────────────────────────────────────────────────────────────
# HALL
# ─────────────────────────────────────────────────────────────────────
class HallOccupancyMixin:
    def get_occupied(self, instance):
        return instance.is_occupied_today

    def get_upcoming_occupied_dates(self, instance):
        return [
            {
                'date': b.date,
                'time_slot': b.time_slot,
                'time_slot_display': b.get_time_slot_display(),
                'booking_code': b.booking_code,
                'event_type_en': b.event_type_en,
            }
            for b in instance.get_upcoming_bookings(limit=2)
        ]


class HallSerializer(HallOccupancyMixin, serializers.ModelSerializer):
    occupied = serializers.SerializerMethodField()
    upcoming_occupied_dates = serializers.SerializerMethodField()

    class Meta:
        model = Hall
        fields = '__all__'
    def validate(self, attrs):
        name_en = attrs.get('name_en', None)
        code_name = attrs.get('code_name', None)

        if self.instance:
            if name_en and Hall.objects.filter(name_en__iexact=name_en, deleted=False).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError('Hall with this name already exists')
            if code_name and Hall.objects.filter(code_name__iexact=code_name, deleted=False).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError('Hall with this code name already exists')
        else:
            if Hall.objects.filter(name_en__iexact=name_en, deleted=False).exists():
                raise serializers.ValidationError('Hall with this name already exists')
            if Hall.objects.filter(code_name__iexact=code_name, deleted=False).exists():
                raise serializers.ValidationError('Hall with this code name already exists')
        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = instance.created_by.full_name if instance.created_by else None
        data['updated_by'] = instance.updated_by.full_name if instance.updated_by else None
        request = self.context.get('request')
        if instance.image and request:
            data['image'] = request.build_absolute_uri(instance.image.url)
        return data


class HallListingSerializer(HallOccupancyMixin, serializers.ModelSerializer):
    occupied = serializers.SerializerMethodField()
    upcoming_occupied_dates = serializers.SerializerMethodField()

    class Meta:
        model = Hall
        fields = ['id', 'name_en', 'name_ar', 'code_name', 'capacity', 'capacity_count',
                  'badge', 'image', 'occupied', 'upcoming_occupied_dates', 'booking_count']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image and request:
            data['image'] = request.build_absolute_uri(instance.image.url)
        return data

# ─────────────────────────────────────────────────────────────────────
# BOOKING
# ─────────────────────────────────────────────────────────────────────
# class BookingSerializer(serializers.ModelSerializer):
#     class Meta:
#         model  = Booking
#         fields = '__all__'

#     def validate(self, attrs):
#         hall      = attrs.get('hall')      or (self.instance.hall      if self.instance else None)
#         date      = attrs.get('date')      or (self.instance.date      if self.instance else None)
#         time_slot = attrs.get('time_slot') or (self.instance.time_slot if self.instance else None)  # ← NEW

#         # Prevent double-booking the same hall on the same date AND time slot
#         if hall and date and time_slot:
#             clashing = Booking.objects.filter(
#                 hall=hall, date=date, time_slot=time_slot, deleted=False  # ← NEW: add time_slot
#             ).exclude(status=CANCELLED)
#             if self.instance:
#                 clashing = clashing.exclude(id=self.instance.id)
#             if clashing.exists():
#                 raise serializers.ValidationError(
#                     'This hall is already booked for the selected date and time slot'
#                 )
#         return attrs

#     def create(self, validated_data):
#         hall = validated_data.get('hall')
#         booking = super().create(validated_data)
        
#         # Update hall occupancy when booking is created
#         if hall and booking.status != 'cancelled':
#             hall.occupied = True
#             # Format: "2026-06-28 (night)"
#             occupied_str = f"{booking.date} ({booking.get_time_slot_display()})"
#             hall.occupied_dates = occupied_str
#             hall.save(update_fields=['occupied', 'occupied_dates'])
        
#         # Recalculate booking count
#         hall.recalculate_booking_count()
        
#         return booking

#     def update(self, instance, validated_data):
#         hall = validated_data.get('hall', instance.hall)
#         old_hall = instance.hall
#         old_status = instance.status
        
#         booking = super().update(instance, validated_data)
        
#         # Update old hall if hall changed
#         if old_hall != hall:
#             old_hall.recalculate_booking_count()
#             if not old_hall.bookings.filter(deleted=False).exclude(status='cancelled').exists():
#                 old_hall.occupied = False
#                 old_hall.occupied_dates = None
#                 old_hall.save(update_fields=['occupied', 'occupied_dates'])
        
#         # Handle status change to cancelled
#         if old_status != 'cancelled' and booking.status == 'cancelled':
#             hall.recalculate_booking_count()
#             if not hall.bookings.filter(deleted=False).exclude(status='cancelled').exists():
#                 hall.occupied = False
#                 hall.occupied_dates = None
#                 hall.save(update_fields=['occupied', 'occupied_dates'])
#         # Handle status change from cancelled to active
#         elif old_status == 'cancelled' and booking.status != 'cancelled':
#             hall.occupied = True
#             occupied_str = f"{booking.date} ({booking.get_time_slot_display()})"
#             hall.occupied_dates = occupied_str
#             hall.save(update_fields=['occupied', 'occupied_dates'])
#         # Update hall occupancy for active bookings
#         elif hall and booking.status != 'cancelled':
#             hall.occupied = True
#             occupied_str = f"{booking.date} ({booking.get_time_slot_display()})"
#             hall.occupied_dates = occupied_str
#             hall.save(update_fields=['occupied', 'occupied_dates'])
        
#         # Recalculate booking count for current hall
#         hall.recalculate_booking_count()
        
#         return booking

#     def to_representation(self, instance):
#         data = super().to_representation(instance)
#         data['created_by']   = instance.created_by.full_name  if instance.created_by  else None
#         data['updated_by']   = instance.updated_by.full_name  if instance.updated_by  else None
#         data['hall_name_en'] = instance.hall.name_en           if instance.hall        else None
#         data['hall_name_ar'] = instance.hall.name_ar           if instance.hall        else None
#         data['customer_name']= instance.customer.name_en       if instance.customer    else None
#         return data


# class BookingListingSerializer(serializers.ModelSerializer):
#     hall_name_en  = serializers.CharField(source='hall.name_en',     read_only=True)
#     hall_name_ar  = serializers.CharField(source='hall.name_ar',     read_only=True)
#     customer_name = serializers.CharField(source='customer.name_en', read_only=True)

#     class Meta:
#         model  = Booking
#         fields = [
#             'id', 'booking_code',
#             'hall', 'hall_name_en', 'hall_name_ar',
#             'customer', 'customer_name',
#             'event_type_en', 'event_type_ar',
#             'date', 'time_slot',          # ← NEW
#             'status', 'total',
#         ]





class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Booking
        fields = '__all__'

    def validate(self, attrs):
        hall      = attrs.get('hall')      or (self.instance.hall      if self.instance else None)
        date      = attrs.get('date')      or (self.instance.date      if self.instance else None)
        time_slot = attrs.get('time_slot') or (self.instance.time_slot if self.instance else None)

        # Prevent double-booking the same hall on the same date AND time slot
        if hall and date and time_slot:
            clashing = Booking.objects.filter(
                hall=hall, date=date, time_slot=time_slot, deleted=False
            ).exclude(status=CANCELLED)
            if self.instance:
                clashing = clashing.exclude(id=self.instance.id)
            if clashing.exists():
                raise serializers.ValidationError(
                    'This hall is already booked for the selected date and time slot'
                )
        return attrs

    def create(self, validated_data):
        booking = super().create(validated_data)
        # occupied / occupied_dates are now computed live on Hall (see is_occupied_today,
        # get_upcoming_bookings) — nothing to write here. Just keep the denormalized count fresh.
        booking.hall.recalculate_booking_count()
        return booking

    def update(self, instance, validated_data):
        old_hall = instance.hall
        booking = super().update(instance, validated_data)

        # If the hall changed, refresh the old hall's count too
        if old_hall != booking.hall:
            old_hall.recalculate_booking_count()

        booking.hall.recalculate_booking_count()
        return booking

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by']    = instance.created_by.full_name if instance.created_by else None
        data['updated_by']    = instance.updated_by.full_name if instance.updated_by else None
        data['hall_name_en']  = instance.hall.name_en          if instance.hall       else None
        data['hall_name_ar']  = instance.hall.name_ar          if instance.hall       else None
        data['customer_name'] = instance.customer.name_en      if instance.customer   else None
        return data


class BookingListingSerializer(serializers.ModelSerializer):
    hall_name_en  = serializers.CharField(source='hall.name_en',     read_only=True)
    hall_name_ar  = serializers.CharField(source='hall.name_ar',     read_only=True)
    customer_name = serializers.CharField(source='customer.name_en', read_only=True)

    class Meta:
        model  = Booking
        fields = [
            'id', 'booking_code',
            'hall', 'hall_name_en', 'hall_name_ar',
            'customer', 'customer_name',
            'event_type_en', 'event_type_ar',
            'date', 'time_slot',
            'status', 'total',
        ]


# ─────────────────────────────────────────────────────────────────────
# ACTIVITY LOG (read-only)
# ─────────────────────────────────────────────────────────────────────
class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'

    def to_representation(self, instance):
        from django.utils.timesince import timesince
        data = super().to_representation(instance)
        data['user_name'] = instance.user.full_name if instance.user else None
        data['time_ago'] = f"{timesince(instance.created_at)} ago"
        return data


# ─────────────────────────────────────────────────────────────────────
# REVENUE / CUSTOMER REPORT ROWS (read-only, computed)
# ─────────────────────────────────────────────────────────────────────
class RevenueReportRowSerializer(serializers.Serializer):
    booking_code = serializers.CharField()
    hall_name_en = serializers.CharField()
    customer_name = serializers.CharField()
    date = serializers.DateField()
    status = serializers.CharField()
    total = serializers.DecimalField(max_digits=12, decimal_places=2)


class CustomerReportRowSerializer(serializers.Serializer):
    customer_name = serializers.CharField()
    bookings_in_period = serializers.IntegerField()


# ─────────────────────────────────────────────────────────────────────
# PAYMENT
# ─────────────────────────────────────────────────────────────────────
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['booking_code'] = instance.booking.booking_code if instance.booking else None
        data['payment_method_display'] = instance.get_payment_method_display()
        data['created_by_name'] = instance.created_by.get_full_name() if instance.created_by else None
        data['updated_by_name'] = instance.updated_by.get_full_name() if instance.updated_by else None
        return data


class PaymentListingSerializer(serializers.ModelSerializer):
    booking_code = serializers.CharField(source='booking.booking_code', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'booking', 'booking_code', 'amount', 'payment_method', 'payment_date', 'notes', 'created_at']


# ─────────────────────────────────────────────────────────────────────
# HALL PRICING
# ─────────────────────────────────────────────────────────────────────
class HallPricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = HallPricing
        fields = '__all__'

    def validate(self, attrs):
        hall = attrs.get('hall')
        time_slot = attrs.get('time_slot')
        valid_from = attrs.get('valid_from')

        if hall and time_slot and valid_from:
            clashing = HallPricing.objects.filter(
                hall=hall, time_slot=time_slot, valid_from=valid_from, deleted=False
            )
            if self.instance:
                clashing = clashing.exclude(id=self.instance.id)
            if clashing.exists():
                raise serializers.ValidationError(
                    'Pricing for this hall, time slot, and valid_from date already exists'
                )
        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['hall_name_en'] = instance.hall.name_en if instance.hall else None
        data['time_slot_display'] = instance.get_time_slot_display()
        data['created_by_name'] = instance.created_by.get_full_name() if instance.created_by else None
        data['updated_by_name'] = instance.updated_by.get_full_name() if instance.updated_by else None
        return data


class HallPricingListingSerializer(serializers.ModelSerializer):
    hall_name_en = serializers.CharField(source='hall.name_en', read_only=True)

    class Meta:
        model = HallPricing
        fields = ['id', 'hall', 'hall_name_en', 'time_slot', 'base_price', 'valid_from', 'valid_until', 'created_at']


# ─────────────────────────────────────────────────────────────────────
# BOOKING SERVICE
# ─────────────────────────────────────────────────────────────────────
class BookingServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingService
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['booking_code'] = instance.booking.booking_code if instance.booking else None
        data['created_by_name'] = instance.created_by.get_full_name() if instance.created_by else None
        data['updated_by_name'] = instance.updated_by.get_full_name() if instance.updated_by else None
        return data


class BookingServiceListingSerializer(serializers.ModelSerializer):
    booking_code = serializers.CharField(source='booking.booking_code', read_only=True)

    class Meta:
        model = BookingService
        fields = ['id', 'booking', 'booking_code', 'service_name_en', 'service_name_ar', 'cost', 'notes', 'created_at']


# ─────────────────────────────────────────────────────────────────────
# HALL AMENITY
# ─────────────────────────────────────────────────────────────────────
class HallAmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = HallAmenity
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['hall_name_en'] = instance.hall.name_en if instance.hall else None
        data['created_by_name'] = instance.created_by.get_full_name() if instance.created_by else None
        data['updated_by_name'] = instance.updated_by.get_full_name() if instance.updated_by else None
        return data


class HallAmenityListingSerializer(serializers.ModelSerializer):
    hall_name_en = serializers.CharField(source='hall.name_en', read_only=True)

    class Meta:
        model = HallAmenity
        fields = ['id', 'hall', 'hall_name_en', 'name_en', 'name_ar', 'description_en', 'description_ar', 'created_at']