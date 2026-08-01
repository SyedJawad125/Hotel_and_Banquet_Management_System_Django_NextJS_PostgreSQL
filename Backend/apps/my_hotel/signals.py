# # signals.py
# from django.db.models.signals import post_save
# from django.dispatch import receiver

# from utils.enums import *
# from .models import ActivityLog, Booking, Customer, Hall, Room, RoomBooking


# # ─────────────────────────────────────────────────────────────────────
# # INTERNAL HELPERS
# # ─────────────────────────────────────────────────────────────────────

# def _log(icon: str, text: str, user=None):
#     """Create one ActivityLog row."""
#     ActivityLog.objects.create(icon=icon, text=text, user=user)


# def _user(instance):
#     """
#     Safely resolve the acting user from the instance.
#     BaseView.post_()  → serializer.save(created_by=request.user)
#     BaseView.patch_() → serializer.save(updated_by=request.user)
#     DRF's save() calls create()/update() which do:
#         instance.created_by = validated_data['created_by']  (or updated_by)
#         instance.save()
#     So by the time post_save fires, the FK id is in the DB but the
#     Python attribute may still be an unsaved id. We prefer updated_by
#     first (most recent actor), then created_by.
#     """
#     return (
#         getattr(instance, 'updated_by', None)
#         or getattr(instance, 'created_by', None)
#     )


# def _is_stat_only_save(update_fields, *stat_field_sets):
#     """
#     Return True when .save(update_fields=...) only touches internal
#     stat/housekeeping fields and should NOT produce an activity log.
#     """
#     if not update_fields:
#         return False
#     uf = set(update_fields)
#     for allowed in stat_field_sets:
#         if uf <= set(allowed):
#             return True
#     return False


# # ─────────────────────────────────────────────────────────────────────
# # BOOKING SIGNAL (HALL)
# # ─────────────────────────────────────────────────────────────────────

# # Fields written by Booking.save() auto-code logic and BookingView.delete()
# # occupancy refresh — we must NOT log these internal saves.
# _BOOKING_INTERNAL_FIELDS = [
#     {'booking_code'},                    # auto-generated code on first save
# ]

# @receiver(post_save, sender=Booking)
# def booking_post_save(sender, instance, created, update_fields, **kwargs):
#     # ── Skip internal/housekeeping saves ──────────────────────────
#     if _is_stat_only_save(update_fields, *_BOOKING_INTERNAL_FIELDS):
#         return

#     user = _user(instance)
#     code  = instance.booking_code or f"#{instance.pk}"
#     cname = instance.customer.name_en
#     hname = instance.hall.name_en
#     date  = instance.date
#     slot  = instance.get_time_slot_display()   # e.g. "Night Shift"

#     # ── Soft-delete (deleted=True saved by BookingView.delete) ────
#     if getattr(instance, 'deleted', False):
#         _log('🗑️',
#              f"Booking {code} for {cname} at {hname} was deleted.",
#              user)
#         return

#     # ── Brand-new booking ─────────────────────────────────────────
#     if created:
#         _log('📅',
#              f"New booking {code} created — {cname} @ {hname} "
#              f"on {date} ({slot}).",
#              user)
#         return

#     # ── Status-specific updates ───────────────────────────────────
#     if instance.status == CANCELLED:
#         _log('❌',
#              f"Booking {code} for {cname} at {hname} was cancelled.",
#              user)
#     elif instance.status == CONFIRMED:
#         _log('✅',
#              f"Booking {code} for {cname} at {hname} was confirmed.",
#              user)
#     else:
#         _log('✏️',
#              f"Booking {code} for {cname} at {hname} was updated "
#              f"(status: {instance.status}).",
#              user)


# # ─────────────────────────────────────────────────────────────────────
# # ROOM BOOKING SIGNAL
# # ─────────────────────────────────────────────────────────────────────

# # Fields written by RoomBooking.save() auto-code logic — skip these.
# _ROOM_BOOKING_INTERNAL_FIELDS = [
#     {'booking_code'},                    # auto-generated code on first save
# ]

# @receiver(post_save, sender=RoomBooking)
# def room_booking_post_save(sender, instance, created, update_fields, **kwargs):
#     # ── Skip internal/housekeeping saves ──────────────────────────
#     if _is_stat_only_save(update_fields, *_ROOM_BOOKING_INTERNAL_FIELDS):
#         return

#     user = _user(instance)
#     code  = instance.booking_code or f"#{instance.pk}"
#     cname = instance.customer.name_en
#     rname = instance.room.name_en
#     date  = instance.date
#     slot  = instance.get_time_slot_display()   # e.g. "Night Shift"

#     # ── Soft-delete (deleted=True saved by RoomBookingView.delete) ─
#     if getattr(instance, 'deleted', False):
#         _log('🗑️',
#              f"Room booking {code} for {cname} at {rname} was deleted.",
#              user)
#         return

#     # ── Brand-new room booking ──────────────────────────────────────
#     if created:
#         _log('📅',
#              f"New room booking {code} created — {cname} @ {rname} "
#              f"on {date} ({slot}).",
#              user)
#         return

#     # ── Status-specific updates ───────────────────────────────────
#     if instance.status == CANCELLED:
#         _log('❌',
#              f"Room booking {code} for {cname} at {rname} was cancelled.",
#              user)
#     elif instance.status == CONFIRMED:
#         _log('✅',
#              f"Room booking {code} for {cname} at {rname} was confirmed.",
#              user)
#     else:
#         _log('✏️',
#              f"Room booking {code} for {cname} at {rname} was updated "
#              f"(status: {instance.status}).",
#              user)


# # ─────────────────────────────────────────────────────────────────────
# # CUSTOMER SIGNAL
# # ─────────────────────────────────────────────────────────────────────

# # Fields written by Customer.recalculate_stats() — skip these saves.
# _CUSTOMER_STAT_FIELDS = {'bookings_count', 'total_spent'}

# @receiver(post_save, sender=Customer)
# def customer_post_save(sender, instance, created, update_fields, **kwargs):
#     # ── Skip stat recalculation saves ─────────────────────────────
#     if _is_stat_only_save(update_fields, _CUSTOMER_STAT_FIELDS):
#         return

#     user = _user(instance)
#     name = instance.name_en

#     if getattr(instance, 'deleted', False):
#         _log('🗑️', f"Customer '{name}' was deleted.", user)
#     elif created:
#         _log('👤', f"New customer '{name}' was added.", user)
#     else:
#         _log('✏️', f"Customer '{name}' details were updated.", user)


# # ─────────────────────────────────────────────────────────────────────
# # HALL SIGNAL
# # ─────────────────────────────────────────────────────────────────────

# # Fields written by Hall.recalculate_booking_count() and the occupancy
# # refresh inside BookingView.delete() — skip all of these.
# _HALL_STAT_FIELDS = {'booking_count', 'occupied', 'occupied_dates'}

# @receiver(post_save, sender=Hall)
# def hall_post_save(sender, instance, created, update_fields, **kwargs):
#     # ── Skip occupancy / count recalculation saves ─────────────────
#     if _is_stat_only_save(update_fields, _HALL_STAT_FIELDS):
#         return

#     user = _user(instance)
#     name = instance.name_en

#     if getattr(instance, 'deleted', False):
#         _log('🗑️', f"Hall '{name}' ({instance.code_name}) was deleted.", user)
#     elif created:
#         _log('🏛️', f"New hall '{name}' ({instance.code_name}) was added.", user)
#     else:
#         _log('✏️', f"Hall '{name}' ({instance.code_name}) details were updated.", user)


# # ─────────────────────────────────────────────────────────────────────
# # ROOM SIGNAL
# # ─────────────────────────────────────────────────────────────────────

# # Fields written by Room.recalculate_booking_count() and the occupancy
# # refresh inside RoomBookingView.delete() — skip all of these.
# _ROOM_STAT_FIELDS = {'booking_count', 'occupied', 'occupied_dates'}

# @receiver(post_save, sender=Room)
# def room_post_save(sender, instance, created, update_fields, **kwargs):
#     # ── Skip occupancy / count recalculation saves ─────────────────
#     if _is_stat_only_save(update_fields, _ROOM_STAT_FIELDS):
#         return

#     user = _user(instance)
#     name = instance.name_en

#     if getattr(instance, 'deleted', False):
#         _log('🗑️', f"Room '{name}' ({instance.code_name}) was deleted.", user)
#     elif created:
#         _log('🚪', f"New room '{name}' ({instance.code_name}) was added.", user)
#     else:
#         _log('✏️', f"Room '{name}' ({instance.code_name}) details were updated.", user)






# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver

from utils.enums import *
from .models import ActivityLog, Booking, Customer, Hall, Room, RoomBooking


# ─────────────────────────────────────────────────────────────────────
# INTERNAL HELPERS
# ─────────────────────────────────────────────────────────────────────

def _log(icon: str, text: str, user=None):
    """Create one ActivityLog row."""
    ActivityLog.objects.create(icon=icon, text=text, user=user)


def _user(instance):
    """
    Safely resolve the acting user from the instance.
    BaseView.post_()  → serializer.save(created_by=request.user)
    BaseView.patch_() → serializer.save(updated_by=request.user)
    DRF's save() calls create()/update() which do:
        instance.created_by = validated_data['created_by']  (or updated_by)
        instance.save()
    So by the time post_save fires, the FK id is in the DB but the
    Python attribute may still be an unsaved id. We prefer updated_by
    first (most recent actor), then created_by.
    """
    return (
        getattr(instance, 'updated_by', None)
        or getattr(instance, 'created_by', None)
    )


def _is_stat_only_save(update_fields, *stat_field_sets):
    """
    Return True when .save(update_fields=...) only touches internal
    stat/housekeeping fields and should NOT produce an activity log.
    """
    if not update_fields:
        return False
    uf = set(update_fields)
    for allowed in stat_field_sets:
        if uf <= set(allowed):
            return True
    return False


# ─────────────────────────────────────────────────────────────────────
# BOOKING SIGNAL (HALL)
# ─────────────────────────────────────────────────────────────────────

# Fields written by Booking.save() auto-code logic and BookingView.delete()
# occupancy refresh — we must NOT log these internal saves.
_BOOKING_INTERNAL_FIELDS = [
    {'booking_code'},                    # auto-generated code on first save
]

@receiver(post_save, sender=Booking)
def booking_post_save(sender, instance, created, update_fields, **kwargs):
    # ── Skip internal/housekeeping saves ──────────────────────────
    if _is_stat_only_save(update_fields, *_BOOKING_INTERNAL_FIELDS):
        return

    user = _user(instance)
    code  = instance.booking_code or f"#{instance.pk}"
    cname = instance.customer.name_en
    hname = instance.hall.name_en
    date  = instance.date
    slot  = instance.get_time_slot_display()   # e.g. "Night Shift"

    # ── Soft-delete (deleted=True saved by BookingView.delete) ────
    if getattr(instance, 'deleted', False):
        _log('🗑️',
             f"Booking {code} for {cname} at {hname} was deleted.",
             user)
        return

    # ── Brand-new booking ─────────────────────────────────────────
    if created:
        _log('📅',
             f"New booking {code} created — {cname} @ {hname} "
             f"on {date} ({slot}).",
             user)
        return

    # ── Status-specific updates ───────────────────────────────────
    if instance.status == CANCELLED:
        _log('❌',
             f"Booking {code} for {cname} at {hname} was cancelled.",
             user)
    elif instance.status == CONFIRMED:
        _log('✅',
             f"Booking {code} for {cname} at {hname} was confirmed.",
             user)
    else:
        _log('✏️',
             f"Booking {code} for {cname} at {hname} was updated "
             f"(status: {instance.status}).",
             user)


# ─────────────────────────────────────────────────────────────────────
# ROOM BOOKING SIGNAL
# ─────────────────────────────────────────────────────────────────────

# Fields written by RoomBooking.save() auto-code logic — skip these.
_ROOM_BOOKING_INTERNAL_FIELDS = [
    {'booking_code'},                    # auto-generated code on first save
]

@receiver(post_save, sender=RoomBooking)
def room_booking_post_save(sender, instance, created, update_fields, **kwargs):
    # ── Skip internal/housekeeping saves ──────────────────────────
    if _is_stat_only_save(update_fields, *_ROOM_BOOKING_INTERNAL_FIELDS):
        return

    user = _user(instance)
    code  = instance.booking_code or f"#{instance.pk}"
    cname = instance.customer.name_en
    rname = instance.room.name_en
    date  = instance.date
    slot  = instance.get_time_slot_display()   # e.g. "Night Shift"

    # ── Soft-delete (deleted=True saved by RoomBookingView.delete) ─
    if getattr(instance, 'deleted', False):
        _log('🗑️',
             f"Room booking {code} for {cname} at {rname} was deleted.",
             user)
        return

    # ── Brand-new room booking ──────────────────────────────────────
    if created:
        _log('📅',
             f"New room booking {code} created — {cname} @ {rname} "
             f"on {date} ({slot}).",
             user)
        return

    # ── Status-specific updates ───────────────────────────────────
    if instance.status == CANCELLED:
        _log('❌',
             f"Room booking {code} for {cname} at {rname} was cancelled.",
             user)
    elif instance.status == CONFIRMED:
        _log('✅',
             f"Room booking {code} for {cname} at {rname} was confirmed.",
             user)
    else:
        _log('✏️',
             f"Room booking {code} for {cname} at {rname} was updated "
             f"(status: {instance.status}).",
             user)


# ─────────────────────────────────────────────────────────────────────
# CUSTOMER SIGNAL
# ─────────────────────────────────────────────────────────────────────

# Fields written by Customer.recalculate_stats() — skip these saves.
_CUSTOMER_STAT_FIELDS = {'bookings_count', 'total_spent'}

@receiver(post_save, sender=Customer)
def customer_post_save(sender, instance, created, update_fields, **kwargs):
    # ── Skip stat recalculation saves ─────────────────────────────
    if _is_stat_only_save(update_fields, _CUSTOMER_STAT_FIELDS):
        return

    user = _user(instance)
    name = instance.name_en

    if getattr(instance, 'deleted', False):
        _log('🗑️', f"Customer '{name}' was deleted.", user)
    elif created:
        _log('👤', f"New customer '{name}' was added.", user)
    else:
        _log('✏️', f"Customer '{name}' details were updated.", user)


# ─────────────────────────────────────────────────────────────────────
# HALL SIGNAL
# ─────────────────────────────────────────────────────────────────────

# Fields written by Hall.recalculate_booking_count() and the occupancy
# refresh inside BookingView.delete() — skip all of these.
_HALL_STAT_FIELDS = {'booking_count', 'occupied', 'occupied_dates'}

@receiver(post_save, sender=Hall)
def hall_post_save(sender, instance, created, update_fields, **kwargs):
    # ── Skip occupancy / count recalculation saves ─────────────────
    if _is_stat_only_save(update_fields, _HALL_STAT_FIELDS):
        return

    user = _user(instance)
    name = instance.name_en

    if getattr(instance, 'deleted', False):
        _log('🗑️', f"Hall '{name}' ({instance.code_name}) was deleted.", user)
    elif created:
        _log('🏛️', f"New hall '{name}' ({instance.code_name}) was added.", user)
    else:
        _log('✏️', f"Hall '{name}' ({instance.code_name}) details were updated.", user)


# ─────────────────────────────────────────────────────────────────────
# ROOM SIGNAL
# ─────────────────────────────────────────────────────────────────────

# Fields written by Room.save() auto-code logic — skip these
# (code_name is now backend-generated on first save, mirroring Booking).
_ROOM_INTERNAL_FIELDS = {'code_name'}

# Fields written by Room.recalculate_booking_count() and the occupancy
# refresh inside RoomBookingView.delete() — skip all of these.
_ROOM_STAT_FIELDS = {'booking_count', 'occupied', 'occupied_dates'}

@receiver(post_save, sender=Room)
def room_post_save(sender, instance, created, update_fields, **kwargs):
    # ── Skip internal/housekeeping saves ────────────────────────────
    if _is_stat_only_save(update_fields, _ROOM_INTERNAL_FIELDS, _ROOM_STAT_FIELDS):
        return

    user = _user(instance)
    name = instance.name_en

    if getattr(instance, 'deleted', False):
        _log('🗑️', f"Room '{name}' ({instance.code_name}) was deleted.", user)
    elif created:
        _log('🚪', f"New room '{name}' ({instance.code_name}) was added.", user)
    else:
        _log('✏️', f"Room '{name}' ({instance.code_name}) details were updated.", user)