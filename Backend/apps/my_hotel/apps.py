# from django.apps import AppConfig


# class MyHotelConfig(AppConfig):
#     default_auto_field = "django.db.models.BigAutoField"
#     name = "apps.my_hotel"




# apps/my_hotel/apps.py
from django.apps import AppConfig


class MyHotelConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.my_hotel'   # must match exactly what's in INSTALLED_APPS

    def ready(self):
        import apps.my_hotel.signals  # noqa: F401