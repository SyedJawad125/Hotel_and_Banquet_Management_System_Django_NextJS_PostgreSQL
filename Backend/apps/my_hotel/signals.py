# # signals.py
# from django.db.models.signals import post_save, post_delete, pre_delete
# from django.dispatch import receiver
# from django.contrib.auth import get_user_model
# from .models import ActivityLog, Booking, Customer, Hall

# User = get_user_model()

# # Helper function to create activity log entries
# def create_activity_log(action, instance, user=None, extra_text=""):
#     """
#     Create an activity log entry for an action on a model instance.
#     """
#     model_name = instance.__class__.__name__
#     instance_identifier = getattr(instance, 'code', None) or getattr(instance, 'name_en', None) or str(instance.id)
    
#     # Define icons for different models and actions
#     icon_map = {
#         'Booking': {'create': '📅', 'update': '✏️', 'delete': '🗑️'},
#         'Customer': {'create': '👤', 'update': '✏️', 'delete': '🗑️'},
#         'Hall': {'create': '🏛️', 'update': '✏️', 'delete': '🗑️'},
#     }
    
#     icon = icon_map.get(model_name, {}).get(action, '🔔')
    
#     # Create user-friendly text
#     action_text = {
#         'create': 'created',
#         'update': 'updated',
#         'delete': 'deleted'
#     }.get(action, action)
    
#     text = f"{icon} {model_name} '{instance_identifier}' was {action_text}{extra_text}"
    
#     # Create the activity log entry
#     ActivityLog.objects.create(
#         icon=icon,
#         text=text,
#         user=user
#     )

# # ─────────────────────────────────────────────────────────────────────
# # BOOKING SIGNALS
# # ─────────────────────────────────────────────────────────────────────
# @receiver(post_save, sender=Booking)
# def booking_post_save(sender, instance, created, **kwargs):
#     """Log when a booking is created or updated"""
#     user = getattr(instance, 'updated_by', None) or getattr(instance, 'created_by', None)
    
#     if created:
#         create_activity_log('create', instance, user, f" for {instance.customer.name_en} at {instance.hall.name_en}")
#     else:
#         # Check if status changed to CANCELLED for special handling
#         if hasattr(instance, 'status') and instance.status == 'CANCELLED':
#             create_activity_log('update', instance, user, f" - Booking was cancelled")
#         else:
#             create_activity_log('update', instance, user, f" - Details were modified")

# @receiver(pre_delete, sender=Booking)
# def booking_pre_delete(sender, instance, **kwargs):
#     """Log when a booking is about to be deleted"""
#     # Store user info before deletion
#     user = getattr(instance, 'updated_by', None) or getattr(instance, 'created_by', None)
#     # Create log before actual deletion
#     create_activity_log('delete', instance, user, f" for {instance.customer.name_en} at {instance.hall.name_en}")

# # ─────────────────────────────────────────────────────────────────────
# # CUSTOMER SIGNALS
# # ─────────────────────────────────────────────────────────────────────
# @receiver(post_save, sender=Customer)
# def customer_post_save(sender, instance, created, **kwargs):
#     """Log when a customer is created or updated"""
#     user = getattr(instance, 'updated_by', None) or getattr(instance, 'created_by', None)
    
#     if created:
#         create_activity_log('create', instance, user, "")
#     else:
#         create_activity_log('update', instance, user, "")

# @receiver(pre_delete, sender=Customer)
# def customer_pre_delete(sender, instance, **kwargs):
#     """Log when a customer is about to be deleted"""
#     user = getattr(instance, 'updated_by', None) or getattr(instance, 'created_by', None)
#     create_activity_log('delete', instance, user, "")

# # ─────────────────────────────────────────────────────────────────────
# # HALL SIGNALS
# # ─────────────────────────────────────────────────────────────────────
# @receiver(post_save, sender=Hall)
# def hall_post_save(sender, instance, created, **kwargs):
#     """Log when a hall is created or updated"""
#     user = getattr(instance, 'updated_by', None) or getattr(instance, 'created_by', None)
    
#     if created:
#         create_activity_log('create', instance, user, "")
#     else:
#         create_activity_log('update', instance, user, "")

# @receiver(pre_delete, sender=Hall)
# def hall_pre_delete(sender, instance, **kwargs):
#     """Log when a hall is about to be deleted"""
#     user = getattr(instance, 'updated_by', None) or getattr(instance, 'created_by', None)
#     create_activity_log('delete', instance, user, "")

# # ─────────────────────────────────────────────────────────────────────
# # HANDLE SOFT DELETES (if using deleted flag)
# # ─────────────────────────────────────────────────────────────────────
# @receiver(post_save, sender=Customer)
# def customer_soft_delete_check(sender, instance, created, **kwargs):
#     """Check if customer was soft-deleted (deleted flag set to True)"""
#     if not created and hasattr(instance, 'deleted') and instance.deleted:
#         user = getattr(instance, 'updated_by', None) or getattr(instance, 'created_by', None)
#         create_activity_log('delete', instance, user, " (soft-deleted)")

# @receiver(post_save, sender=Hall)
# def hall_soft_delete_check(sender, instance, created, **kwargs):
#     """Check if hall was soft-deleted (deleted flag set to True)"""
#     if not created and hasattr(instance, 'deleted') and instance.deleted:
#         user = getattr(instance, 'updated_by', None) or getattr(instance, 'created_by', None)
#         create_activity_log('delete', instance, user, " (soft-deleted)")

# @receiver(post_save, sender=Booking)
# def booking_soft_delete_check(sender, instance, created, **kwargs):
#     """Check if booking was soft-deleted (deleted flag set to True)"""
#     if not created and hasattr(instance, 'deleted') and instance.deleted:
#         user = getattr(instance, 'updated_by', None) or getattr(instance, 'created_by', None)
#         create_activity_log('delete', instance, user, f" for {instance.customer.name_en} at {instance.hall.name_en} (soft-deleted)")



# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver

from utils.enums import *
from .models import ActivityLog, Booking, Customer, Hall


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
# BOOKING SIGNAL
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