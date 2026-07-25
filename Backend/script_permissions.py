import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django

django.setup()

from apps.users.models import Permission

permissions = [
    Permission(name='Show Role', code_name='show_role', module_name='Role', module_label='User Management', description='User can see role'),
    Permission(name='Create Role', code_name='create_role', module_name='Role', module_label='User Management', description='User can create role'),
    Permission(name='Read Role', code_name='read_role', module_name='Role', module_label='User Management', description='User can read role'),
    Permission(name='Update Role', code_name='update_role', module_name='Role', module_label='User Management', description='User can update role'),
    Permission(name='Delete Role', code_name='delete_role', module_name='Role', module_label='User Management', description='User can delete role'),

    Permission(name='Show Permission', code_name='show_permission', module_name='Permission', module_label='User Permission', description='User can see Permission'),
    Permission(name='Create Permission', code_name='create_permission', module_name='Permission', module_label='User Permission', description='User can create Permission'),
    Permission(name='Read Permission', code_name='read_permission', module_name='Permission', module_label='User Permission', description='User can read Permission'),
    Permission(name='Update Permission', code_name='update_permission', module_name='Permission', module_label='User Permission', description='User can update Permission'),
    Permission(name='Delete Permission', code_name='delete_permission', module_name='Permission', module_label='User Permission', description='User can delete Permission'),

    Permission(name='Show User', code_name='show_user', module_name='User', module_label='User Management',
               description='User can see user'),
    Permission(name='Create User', code_name='create_user', module_name='User', module_label='User Management',
               description='User can create user'),
    Permission(name='Read User', code_name='read_user', module_name='User', module_label='User Management',
               description='User can read user'),
    Permission(name='Update User', code_name='update_user', module_name='User', module_label='User Management',
               description='User can update user'),
    Permission(name='Delete User', code_name='delete_user', module_name='User', module_label='User Management',
               description='User can delete user'),
    Permission(name='Deactivate User', code_name='toggle_user', module_name='User', module_label='User Management',
               description='User can deactivate user'),

    # ---------- Image ----------
    Permission(name='Create Image', code_name='create_image', module_name='Image', module_label='Image Management',
            description='User can create Image'),
    Permission(name='Read Image', code_name='read_image', module_name='Image', module_label='Image Management',
            description='User can read Image'),
    Permission(name='Update Image', code_name='update_image', module_name='Image', module_label='Image Management',
            description='User can update Image'),
    Permission(name='Delete Image', code_name='delete_image', module_name='Image', module_label='Image Management',
            description='User can delete Image'),

            # ---------- Category ----------
    Permission(name='Create Image Category', code_name='create_image_category', module_name='Image Category', module_label=' Image Category Management',
            description='User can create Image Category'),
    Permission(name='Read Image Category', code_name='read_image_category', module_name='Image Category', module_label='Image Category Management',
            description='User can read Image Category'),
    Permission(name='Update Image Category', code_name='update_image_category', module_name='Image Category', module_label='Image Category Management',
            description='User can update Image Category'),
    Permission(name='Delete Image Category', code_name='delete_image_category', module_name='Image Category', module_label='Image Category Management',
            description='User can delete Image Category'),

    # ─────────────────────────────────────────────────────────────
    # CUSTOMER
    # ─────────────────────────────────────────────────────────────
    Permission(name='Show Customer', code_name='show_customer', module_name='Customer',
               module_label='Customer Management', description='User can see customer'),
    Permission(name='Create Customer', code_name='create_customer', module_name='Customer',
               module_label='Customer Management', description='User can create customer'),
    Permission(name='Read Customer', code_name='read_customer', module_name='Customer',
               module_label='Customer Management', description='User can read customer'),
    Permission(name='Update Customer', code_name='update_customer', module_name='Customer',
               module_label='Customer Management', description='User can update customer'),
    Permission(name='Delete Customer', code_name='delete_customer', module_name='Customer',
               module_label='Customer Management', description='User can delete customer'),
 
    # ─────────────────────────────────────────────────────────────
    # HALL
    # ─────────────────────────────────────────────────────────────
    Permission(name='Show Hall', code_name='show_hall', module_name='Hall',
               module_label='Halls & Venues', description='User can see hall'),
    Permission(name='Create Hall', code_name='create_hall', module_name='Hall',
               module_label='Halls & Venues', description='User can create hall'),
    Permission(name='Read Hall', code_name='read_hall', module_name='Hall',
               module_label='Halls & Venues', description='User can read hall'),
    Permission(name='Update Hall', code_name='update_hall', module_name='Hall',
               module_label='Halls & Venues', description='User can update hall'),
    Permission(name='Delete Hall', code_name='delete_hall', module_name='Hall',
               module_label='Halls & Venues', description='User can delete hall'),
 
    # ─────────────────────────────────────────────────────────────
    # BOOKING
    # ─────────────────────────────────────────────────────────────
    Permission(name='Show Booking', code_name='show_booking', module_name='Booking',
               module_label='Event Bookings', description='User can see booking'),
    Permission(name='Create Booking', code_name='create_booking', module_name='Booking',
               module_label='Event Bookings', description='User can create booking'),
    Permission(name='Read Booking', code_name='read_booking', module_name='Booking',
               module_label='Event Bookings', description='User can read booking'),
    Permission(name='Update Booking', code_name='update_booking', module_name='Booking',
               module_label='Event Bookings', description='User can update booking'),
    Permission(name='Delete Booking', code_name='delete_booking', module_name='Booking',
               module_label='Event Bookings', description='User can delete booking'),
 
    # ─────────────────────────────────────────────────────────────
    # ACTIVITY LOG
    # ─────────────────────────────────────────────────────────────
    Permission(name='Show Activity Log', code_name='show_activity_log', module_name='ActivityLog',
               module_label='Dashboard', description='User can see activity log'),
    Permission(name='Read Activity Log', code_name='read_activity_log', module_name='ActivityLog',
               module_label='Dashboard', description='User can read activity log'),
 
    # ─────────────────────────────────────────────────────────────
    # DASHBOARD
    # ─────────────────────────────────────────────────────────────
    Permission(name='Show Dashboard', code_name='show_dashboard', module_name='Dashboard',
               module_label='Dashboard', description='User can see dashboard'),
    Permission(name='Read Dashboard', code_name='read_dashboard', module_name='Dashboard',
               module_label='Dashboard', description='User can read dashboard stats'),
 
    # ─────────────────────────────────────────────────────────────
    # REPORTS & ANALYTICS
    # ─────────────────────────────────────────────────────────────
    Permission(name='Show Reports', code_name='show_reports', module_name='Reports',
               module_label='Reports & Analytics', description='User can see reports'),
    Permission(name='Read Reports', code_name='read_reports', module_name='Reports',
               module_label='Reports & Analytics', description='User can read/generate reports'),

    # ─────────────────────────────────────────────────────────────
    # PAYMENT
    # ─────────────────────────────────────────────────────────────
    Permission(name='Show Payment', code_name='show_payment', module_name='Payment',
               module_label='Payment Management', description='User can see payment'),
    Permission(name='Create Payment', code_name='create_payment', module_name='Payment',
               module_label='Payment Management', description='User can create payment'),
    Permission(name='Read Payment', code_name='read_payment', module_name='Payment',
               module_label='Payment Management', description='User can read payment'),
    Permission(name='Update Payment', code_name='update_payment', module_name='Payment',
               module_label='Payment Management', description='User can update payment'),
    Permission(name='Delete Payment', code_name='delete_payment', module_name='Payment',
               module_label='Payment Management', description='User can delete payment'),

    # ─────────────────────────────────────────────────────────────
    # HALL PRICING
    # ─────────────────────────────────────────────────────────────
    Permission(name='Show Hall Pricing', code_name='show_hall_pricing', module_name='HallPricing',
               module_label='Hall Pricing', description='User can see hall pricing'),
    Permission(name='Create Hall Pricing', code_name='create_hall_pricing', module_name='HallPricing',
               module_label='Hall Pricing', description='User can create hall pricing'),
    Permission(name='Read Hall Pricing', code_name='read_hall_pricing', module_name='HallPricing',
               module_label='Hall Pricing', description='User can read hall pricing'),
    Permission(name='Update Hall Pricing', code_name='update_hall_pricing', module_name='HallPricing',
               module_label='Hall Pricing', description='User can update hall pricing'),
    Permission(name='Delete Hall Pricing', code_name='delete_hall_pricing', module_name='HallPricing',
               module_label='Hall Pricing', description='User can delete hall pricing'),

    # ─────────────────────────────────────────────────────────────
    # BOOKING SERVICE
    # ─────────────────────────────────────────────────────────────
    Permission(name='Show Booking Service', code_name='show_booking_service', module_name='BookingService',
               module_label='Booking Services', description='User can see booking service'),
    Permission(name='Create Booking Service', code_name='create_booking_service', module_name='BookingService',
               module_label='Booking Services', description='User can create booking service'),
    Permission(name='Read Booking Service', code_name='read_booking_service', module_name='BookingService',
               module_label='Booking Services', description='User can read booking service'),
    Permission(name='Update Booking Service', code_name='update_booking_service', module_name='BookingService',
               module_label='Booking Services', description='User can update booking service'),
    Permission(name='Delete Booking Service', code_name='delete_booking_service', module_name='BookingService',
               module_label='Booking Services', description='User can delete booking service'),

    # ─────────────────────────────────────────────────────────────
    # HALL AMENITY
    # ─────────────────────────────────────────────────────────────
    Permission(name='Show Hall Amenity', code_name='show_hall_amenity', module_name='HallAmenity',
               module_label='Hall Amenities', description='User can see hall amenity'),
    Permission(name='Create Hall Amenity', code_name='create_hall_amenity', module_name='HallAmenity',
               module_label='Hall Amenities', description='User can create hall amenity'),
    Permission(name='Read Hall Amenity', code_name='read_hall_amenity', module_name='HallAmenity',
               module_label='Hall Amenities', description='User can read hall amenity'),
    Permission(name='Update Hall Amenity', code_name='update_hall_amenity', module_name='HallAmenity',
               module_label='Hall Amenities', description='User can update hall amenity'),
    Permission(name='Delete Hall Amenity', code_name='delete_hall_amenity', module_name='HallAmenity',
               module_label='Hall Amenities', description='User can delete hall amenity'),
]


def add_permission():
    for permission in permissions:
        try:
            Permission.objects.get(code_name=permission.code_name)
        except Permission.DoesNotExist:
            permission.save()


if __name__ == '__main__':
    print("Populating Permissions ...")
    add_permission()