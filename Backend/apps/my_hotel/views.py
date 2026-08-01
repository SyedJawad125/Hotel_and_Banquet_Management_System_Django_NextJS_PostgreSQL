# from django.shortcuts import render
# from rest_framework.views import APIView

# # Create your views here.from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from rest_framework import status
# from django.db.models import Sum

# from utils.base_api import BaseView
# from utils.reusable_functions import create_response
# from utils.response_messages import *
# from utils.decorator import permission_required
# from utils.enums import *
# from utils.permission_enums import *


# from .models import Customer, Hall, Booking, ActivityLog, Payment, HallPricing, BookingService, HallAmenity, Room, RoomBooking, revenue_report, customer_report, room_revenue_report
# from .serializers import (
#     CustomerSerializer, CustomerListingSerializer,
#     HallSerializer, HallListingSerializer,
#     BookingSerializer, BookingListingSerializer,
#     ActivityLogSerializer,
#     RevenueReportRowSerializer, CustomerReportRowSerializer,
#     PaymentSerializer, PaymentListingSerializer,
#     HallPricingSerializer, HallPricingListingSerializer,
#     BookingServiceSerializer, BookingServiceListingSerializer,
#     HallAmenitySerializer, HallAmenityListingSerializer,
# )
# from .filters import CustomerFilter, HallFilter, BookingFilter, ActivityLogFilter, PaymentFilter, HallPricingFilter, BookingServiceFilter, HallAmenityFilter


# # ─────────────────────────────────────────────────────────────────────
# # CUSTOMER
# # ─────────────────────────────────────────────────────────────────────
# class CustomerView(BaseView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = CustomerSerializer
#     filterset_class = CustomerFilter
#     list_serializer = CustomerListingSerializer

#     @permission_required([CREATE_CUSTOMER])
#     def post(self, request):
#         return super().post_(request)

#     @permission_required([READ_CUSTOMER])
#     def get(self, request):
#         return super().get_(request)

#     @permission_required([UPDATE_CUSTOMER])
#     def patch(self, request):
#         return super().patch_(request)

#     @permission_required([DELETE_CUSTOMER])
#     def delete(self, request):
#         try:
#             if request.query_params.get('id'):
#                 instance = self.serializer_class.Meta.model.objects.filter(
#                     deleted=False, id=request.query_params.get('id', None)
#                 ).first()
#                 if instance:
#                     if instance.bookings.filter(deleted=False).exists():
#                         return Response(create_response(CUSTOMER_HAS_BOOKINGS), status=status.HTTP_400_BAD_REQUEST)
#                     instance.deleted = True
#                     instance.updated_by = request.user
#                     instance.save()
#                     serialized_resp = self.serializer_class(instance).data
#                     return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
#                 else:
#                     return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
#             else:
#                 return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             print(str(e))
#             return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# # ─────────────────────────────────────────────────────────────────────
# # HALL
# # ─────────────────────────────────────────────────────────────────────
# class HallView(BaseView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = HallSerializer
#     filterset_class = HallFilter
#     list_serializer = HallListingSerializer

#     @permission_required([CREATE_HALL])
#     def post(self, request):
#         return super().post_(request)

#     @permission_required([READ_HALL])
#     def get(self, request):
#         return super().get_(request)

#     @permission_required([UPDATE_HALL])
#     def patch(self, request):
#         return super().patch_(request)

#     @permission_required([DELETE_HALL])
#     def delete(self, request):
#         try:
#             if request.query_params.get('id'):
#                 instance = self.serializer_class.Meta.model.objects.filter(
#                     deleted=False, id=request.query_params.get('id', None)
#                 ).first()
#                 if instance:
#                     if instance.bookings.filter(deleted=False).exclude(status=CANCELLED).exists():
#                         return Response(create_response(HALL_HAS_ACTIVE_BOOKINGS), status=status.HTTP_400_BAD_REQUEST)
#                     instance.deleted = True
#                     instance.updated_by = request.user
#                     instance.save()
#                     serialized_resp = self.serializer_class(instance).data
#                     return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
#                 else:
#                     return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
#             else:
#                 return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             print(str(e))
#             return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# # ─────────────────────────────────────────────────────────────────────
# # BOOKING
# # ─────────────────────────────────────────────────────────────────────
# class BookingView(BaseView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = BookingSerializer
#     filterset_class = BookingFilter
#     list_serializer = BookingListingSerializer

#     @permission_required([CREATE_BOOKING])
#     def post(self, request):
#         return super().post_(request)

#     @permission_required([READ_BOOKING])
#     def get(self, request):
#         return super().get_(request)

#     @permission_required([UPDATE_BOOKING])
#     def patch(self, request):
#         return super().patch_(request)

#     @permission_required([DELETE_BOOKING])
#     def delete(self, request):
#         try:
#             if request.query_params.get('id'):
#                 instance = self.serializer_class.Meta.model.objects.filter(
#                     deleted=False, id=request.query_params.get('id', None)
#                 ).first()
#                 if instance:
#                     hall = instance.hall
#                     customer = instance.customer
#                     instance.deleted = True
#                     instance.updated_by = request.user
#                     instance.save()

#                     # refresh hall occupancy + counts after soft-delete
#                     hall.recalculate_booking_count()
#                     if not hall.bookings.filter(deleted=False).exclude(status=CANCELLED).exists():
#                         hall.occupied = False
#                         hall.occupied_dates = None
#                         hall.save(update_fields=['occupied', 'occupied_dates'])
#                     customer.recalculate_stats()

#                     serialized_resp = self.serializer_class(instance).data
#                     return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
#                 else:
#                     return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
#             else:
#                 return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             print(str(e))
#             return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# # ─────────────────────────────────────────────────────────────────────
# # ACTIVITY LOG (read-only)
# # ─────────────────────────────────────────────────────────────────────
# class ActivityLogView(BaseView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = ActivityLogSerializer
#     filterset_class = ActivityLogFilter

#     @permission_required([READ_ACTIVITY_LOG])
#     def get(self, request):
#         return super().get_(request)


# # ─────────────────────────────────────────────────────────────────────
# # DASHBOARD STATS (computed, read-only)
# # ─────────────────────────────────────────────────────────────────────
# class DashboardStatsView(APIView):
#     permission_classes = (IsAuthenticated,)

#     @permission_required([READ_DASHBOARD])
#     def get(self, request):
#         try:
#             halls = Hall.objects.filter(deleted=False)
#             bookings = Booking.objects.filter(deleted=False)

#             total_halls = halls.count()
#             occupied_count = halls.filter(occupied=True).count()
#             occupancy_rate = round((occupied_count / total_halls) * 100) if total_halls else 0
#             active_bookings = bookings.count()
#             total_revenue = bookings.aggregate(s=Sum('total'))['s'] or 0

#             popular_halls = halls.order_by('-booking_count')[:5]
#             popular_halls_data = HallListingSerializer(popular_halls, many=True, context={'request': request}).data

#             upcoming_events = bookings.exclude(status=CANCELLED).order_by('date')[:3]
#             upcoming_events_data = BookingListingSerializer(upcoming_events, many=True).data

#             data = {
#                 'total_halls': total_halls,
#                 'occupancy_rate': occupancy_rate,
#                 'active_bookings': active_bookings,
#                 'total_revenue': total_revenue,
#                 'popular_halls': popular_halls_data,
#                 'upcoming_events': upcoming_events_data,
#             }
#             return Response(create_response(SUCCESSFUL, data), status=status.HTTP_200_OK)
#         except Exception as e:
#             print(str(e))
#             return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# # ─────────────────────────────────────────────────────────────────────
# # REVENUE REPORT (computed, read-only export)
# # ─────────────────────────────────────────────────────────────────────
# class RevenueReportView(APIView):
#     permission_classes = (IsAuthenticated,)

#     @permission_required([READ_REPORTS])
#     def get(self, request):
#         try:
#             start_date = request.query_params.get('date_from')
#             end_date = request.query_params.get('date_to')
#             rows = revenue_report(start_date, end_date)

#             data = [{
#                 'booking_code': r['booking_code'],
#                 'hall_name_en': r['hall__name_en'],
#                 'customer_name': r['customer__name_en'],
#                 'date': r['date'],
#                 'status': r['status'],
#                 'total': r['total'],
#             } for r in rows]

#             serialized = RevenueReportRowSerializer(data, many=True).data
#             total_revenue = sum(r['total'] for r in data)
#             return Response(create_response(SUCCESSFUL, {
#                 'rows': serialized,
#                 'total_revenue': total_revenue,
#                 'count': len(serialized),
#             }), status=status.HTTP_200_OK)
#         except Exception as e:
#             print(str(e))
#             return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# # ─────────────────────────────────────────────────────────────────────
# # CUSTOMER REPORT (computed, read-only export)
# # ─────────────────────────────────────────────────────────────────────
# class CustomerReportView(APIView):
#     permission_classes = (IsAuthenticated,)

#     @permission_required([READ_REPORTS])
#     def get(self, request):
#         try:
#             start_date = request.query_params.get('date_from')
#             end_date = request.query_params.get('date_to')
#             rows = customer_report(start_date, end_date)

#             data = [{
#                 'customer_name': r['customer__name_en'],
#                 'bookings_in_period': r['bookings_in_period'],
#             } for r in rows]

#             serialized = CustomerReportRowSerializer(data, many=True).data
#             return Response(create_response(SUCCESSFUL, {
#                 'rows': serialized,
#                 'count': len(serialized),
#             }), status=status.HTTP_200_OK)
#         except Exception as e:
#             print(str(e))
#             return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# # ─────────────────────────────────────────────────────────────────────
# # PAYMENT
# # ─────────────────────────────────────────────────────────────────────
# class PaymentView(BaseView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = PaymentSerializer
#     filterset_class = PaymentFilter
#     list_serializer = PaymentListingSerializer

#     @permission_required([CREATE_PAYMENT])
#     def post(self, request):
#         return super().post_(request)

#     @permission_required([READ_PAYMENT])
#     def get(self, request):
#         return super().get_(request)

#     @permission_required([UPDATE_PAYMENT])
#     def patch(self, request):
#         return super().patch_(request)

#     @permission_required([DELETE_PAYMENT])
#     def delete(self, request):
#         try:
#             if request.query_params.get('id'):
#                 instance = self.serializer_class.Meta.model.objects.filter(
#                     deleted=False, id=request.query_params.get('id', None)
#                 ).first()
#                 if instance:
#                     instance.deleted = True
#                     instance.save()
#                     serialized_resp = self.serializer_class(instance).data
#                     return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
#                 else:
#                     return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
#             else:
#                 return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             print(str(e))
#             return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# # ─────────────────────────────────────────────────────────────────────
# # HALL PRICING
# # ─────────────────────────────────────────────────────────────────────
# class HallPricingView(BaseView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = HallPricingSerializer
#     filterset_class = HallPricingFilter
#     list_serializer = HallPricingListingSerializer

#     @permission_required([CREATE_HALL_PRICING])
#     def post(self, request):
#         return super().post_(request)

#     @permission_required([READ_HALL_PRICING])
#     def get(self, request):
#         return super().get_(request)

#     @permission_required([UPDATE_HALL_PRICING])
#     def patch(self, request):
#         return super().patch_(request)

#     @permission_required([DELETE_HALL_PRICING])
#     def delete(self, request):
#             try:
#                 if request.query_params.get('id'):
#                     instance = self.serializer_class.Meta.model.objects.filter(
#                         deleted=False, id=request.query_params.get('id', None)
#                     ).first()
#                     if instance:
#                         instance.deleted = True
#                         instance.save()
#                         serialized_resp = self.serializer_class(instance).data
#                         return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
#                     else:
#                         return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
#                 else:
#                     return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
#             except Exception as e:
#                 print(str(e))
#                 return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# # ─────────────────────────────────────────────────────────────────────
# # BOOKING SERVICE
# # ─────────────────────────────────────────────────────────────────────
# class BookingServiceView(BaseView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = BookingServiceSerializer
#     filterset_class = BookingServiceFilter
#     list_serializer = BookingServiceListingSerializer

#     @permission_required([CREATE_BOOKING_SERVICE])
#     def post(self, request):
#         return super().post_(request)

#     @permission_required([READ_BOOKING_SERVICE])
#     def get(self, request):
#         return super().get_(request)

#     @permission_required([UPDATE_BOOKING_SERVICE])
#     def patch(self, request):
#         return super().patch_(request)

#     @permission_required([DELETE_BOOKING_SERVICE])
#     def delete(self, request):
#         try:
#             if request.query_params.get('id'):
#                 instance = self.serializer_class.Meta.model.objects.filter(
#                     deleted=False, id=request.query_params.get('id', None)
#                 ).first()
#                 if instance:
#                     instance.deleted = True
#                     instance.save()
#                     serialized_resp = self.serializer_class(instance).data
#                     return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
#                 else:
#                     return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
#             else:
#                 return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             print(str(e))
#             return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# # ─────────────────────────────────────────────────────────────────────
# # HALL AMENITY
# # ─────────────────────────────────────────────────────────────────────
# class HallAmenityView(BaseView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = HallAmenitySerializer
#     filterset_class = HallAmenityFilter
#     list_serializer = HallAmenityListingSerializer

#     @permission_required([CREATE_HALL_AMENITY])
#     def post(self, request):
#         return super().post_(request)

#     @permission_required([READ_HALL_AMENITY])
#     def get(self, request):
#         return super().get_(request)

#     @permission_required([UPDATE_HALL_AMENITY])
#     def patch(self, request):
#         return super().patch_(request)

#     @permission_required([DELETE_HALL_AMENITY])
#     def delete(self, request):
#         try:
#             if request.query_params.get('id'):
#                 instance = self.serializer_class.Meta.model.objects.filter(
#                     deleted=False, id=request.query_params.get('id', None)
#                 ).first()
#                 if instance:
#                     instance.deleted = True
#                     instance.save()
#                     serialized_resp = self.serializer_class(instance).data
#                     return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
#                 else:
#                     return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
#             else:
#                 return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             print(str(e))
#             return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)








from django.shortcuts import render
from rest_framework.views import APIView

# Create your views here.
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Sum

from utils.base_api import BaseView
from utils.reusable_functions import create_response
from utils.response_messages import *
from utils.decorator import permission_required
from utils.enums import *
from utils.permission_enums import *


from .models import (
    Customer, Hall, Booking, ActivityLog, Payment, HallPricing, BookingService, HallAmenity,
    revenue_report, customer_report,
    Room, RoomBooking, RoomPricing, RoomAmenity, room_revenue_report,
)
from .serializers import (
    CustomerSerializer, CustomerListingSerializer,
    HallSerializer, HallListingSerializer,
    RoomSerializer, RoomListingSerializer,
    BookingSerializer, BookingListingSerializer,
    RoomBookingSerializer, RoomBookingListingSerializer,
    ActivityLogSerializer,
    RevenueReportRowSerializer, RoomRevenueReportRowSerializer, CustomerReportRowSerializer,
    PaymentSerializer, PaymentListingSerializer,
    HallPricingSerializer, HallPricingListingSerializer,
    RoomPricingSerializer, RoomPricingListingSerializer,
    BookingServiceSerializer, BookingServiceListingSerializer,
    HallAmenitySerializer, HallAmenityListingSerializer,
    RoomAmenitySerializer, RoomAmenityListingSerializer,
)
from .filters import (
    CustomerFilter, HallFilter, RoomFilter, BookingFilter, RoomBookingFilter, ActivityLogFilter,
    PaymentFilter, HallPricingFilter, RoomPricingFilter, BookingServiceFilter,
    HallAmenityFilter, RoomAmenityFilter,
)


# ─────────────────────────────────────────────────────────────────────
# CUSTOMER
# ─────────────────────────────────────────────────────────────────────
class CustomerView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomerSerializer
    filterset_class = CustomerFilter
    list_serializer = CustomerListingSerializer

    @permission_required([CREATE_CUSTOMER])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_CUSTOMER])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_CUSTOMER])
    def patch(self, request):
        return super().patch_(request)

    @permission_required([DELETE_CUSTOMER])
    def delete(self, request):
        try:
            if request.query_params.get('id'):
                instance = self.serializer_class.Meta.model.objects.filter(
                    deleted=False, id=request.query_params.get('id', None)
                ).first()
                if instance:
                    # block delete if customer has active hall OR room bookings
                    if instance.bookings.filter(deleted=False).exists() or \
                       instance.room_bookings.filter(deleted=False).exists():
                        return Response(create_response(CUSTOMER_HAS_BOOKINGS), status=status.HTTP_400_BAD_REQUEST)
                    instance.deleted = True
                    instance.updated_by = request.user
                    instance.save()
                    serialized_resp = self.serializer_class(instance).data
                    return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
                else:
                    return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────────────────────────────
# HALL
# ─────────────────────────────────────────────────────────────────────
class HallView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = HallSerializer
    filterset_class = HallFilter
    list_serializer = HallListingSerializer

    @permission_required([CREATE_HALL])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_HALL])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_HALL])
    def patch(self, request):
        return super().patch_(request)

    @permission_required([DELETE_HALL])
    def delete(self, request):
        try:
            if request.query_params.get('id'):
                instance = self.serializer_class.Meta.model.objects.filter(
                    deleted=False, id=request.query_params.get('id', None)
                ).first()
                if instance:
                    if instance.bookings.filter(deleted=False).exclude(status=CANCELLED).exists():
                        return Response(create_response(HALL_HAS_ACTIVE_BOOKINGS), status=status.HTTP_400_BAD_REQUEST)
                    instance.deleted = True
                    instance.updated_by = request.user
                    instance.save()
                    serialized_resp = self.serializer_class(instance).data
                    return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
                else:
                    return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────────────────────────────
# ROOM
# ─────────────────────────────────────────────────────────────────────
class RoomView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = RoomSerializer
    filterset_class = RoomFilter
    list_serializer = RoomListingSerializer

    @permission_required([CREATE_ROOM])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_ROOM])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_ROOM])
    def patch(self, request):
        return super().patch_(request)

    @permission_required([DELETE_ROOM])
    def delete(self, request):
        try:
            if request.query_params.get('id'):
                instance = self.serializer_class.Meta.model.objects.filter(
                    deleted=False, id=request.query_params.get('id', None)
                ).first()
                if instance:
                    if instance.bookings.filter(deleted=False).exclude(status=RoomBooking.STATUS_CANCELLED).exists():
                        return Response(create_response(ROOM_HAS_ACTIVE_BOOKINGS), status=status.HTTP_400_BAD_REQUEST)
                    instance.deleted = True
                    instance.updated_by = request.user
                    instance.save()
                    serialized_resp = self.serializer_class(instance).data
                    return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
                else:
                    return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────────────────────────────
# BOOKING (HALL)
# ─────────────────────────────────────────────────────────────────────
class BookingView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = BookingSerializer
    filterset_class = BookingFilter
    list_serializer = BookingListingSerializer

    @permission_required([CREATE_BOOKING])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_BOOKING])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_BOOKING])
    def patch(self, request):
        return super().patch_(request)

    @permission_required([DELETE_BOOKING])
    def delete(self, request):
        try:
            if request.query_params.get('id'):
                instance = self.serializer_class.Meta.model.objects.filter(
                    deleted=False, id=request.query_params.get('id', None)
                ).first()
                if instance:
                    hall = instance.hall
                    customer = instance.customer
                    instance.deleted = True
                    instance.updated_by = request.user
                    instance.save()

                    # refresh hall occupancy + counts after soft-delete
                    hall.recalculate_booking_count()
                    if not hall.bookings.filter(deleted=False).exclude(status=CANCELLED).exists():
                        hall.occupied = False
                        hall.occupied_dates = None
                        hall.save(update_fields=['occupied', 'occupied_dates'])
                    customer.recalculate_stats()

                    serialized_resp = self.serializer_class(instance).data
                    return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
                else:
                    return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────────────────────────────
# ROOM BOOKING
# ─────────────────────────────────────────────────────────────────────
class RoomBookingView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = RoomBookingSerializer
    filterset_class = RoomBookingFilter
    list_serializer = RoomBookingListingSerializer

    @permission_required([CREATE_ROOM_BOOKING])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_ROOM_BOOKING])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_ROOM_BOOKING])
    def patch(self, request):
        return super().patch_(request)

    @permission_required([DELETE_ROOM_BOOKING])
    def delete(self, request):
        try:
            if request.query_params.get('id'):
                instance = self.serializer_class.Meta.model.objects.filter(
                    deleted=False, id=request.query_params.get('id', None)
                ).first()
                if instance:
                    room = instance.room
                    customer = instance.customer
                    instance.deleted = True
                    instance.updated_by = request.user
                    instance.save()

                    # refresh room occupancy + counts after soft-delete
                    room.recalculate_booking_count()
                    if not room.bookings.filter(deleted=False).exclude(status=RoomBooking.STATUS_CANCELLED).exists():
                        room.occupied = False
                        room.occupied_dates = None
                        room.save(update_fields=['occupied', 'occupied_dates'])
                    customer.recalculate_stats()

                    serialized_resp = self.serializer_class(instance).data
                    return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
                else:
                    return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────────────────────────────
# ACTIVITY LOG (read-only)
# ─────────────────────────────────────────────────────────────────────
class ActivityLogView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ActivityLogSerializer
    filterset_class = ActivityLogFilter

    @permission_required([READ_ACTIVITY_LOG])
    def get(self, request):
        return super().get_(request)


# ─────────────────────────────────────────────────────────────────────
# DASHBOARD STATS (computed, read-only)
# ─────────────────────────────────────────────────────────────────────
class DashboardStatsView(APIView):
    permission_classes = (IsAuthenticated,)

    @permission_required([READ_DASHBOARD])
    def get(self, request):
        try:
            halls = Hall.objects.filter(deleted=False)
            rooms = Room.objects.filter(deleted=False)
            bookings = Booking.objects.filter(deleted=False)
            room_bookings = RoomBooking.objects.filter(deleted=False)

            total_halls = halls.count()
            total_rooms = rooms.count()
            occupied_count = halls.filter(occupied=True).count()
            occupancy_rate = round((occupied_count / total_halls) * 100) if total_halls else 0
            active_bookings = bookings.count() + room_bookings.count()
            total_revenue = (bookings.aggregate(s=Sum('total'))['s'] or 0) + \
                             (room_bookings.aggregate(s=Sum('total'))['s'] or 0)

            popular_halls = halls.order_by('-booking_count')[:5]
            popular_halls_data = HallListingSerializer(popular_halls, many=True, context={'request': request}).data

            popular_rooms = rooms.order_by('-booking_count')[:5]
            popular_rooms_data = RoomListingSerializer(popular_rooms, many=True, context={'request': request}).data

            upcoming_events = bookings.exclude(status=CANCELLED).order_by('date')[:3]
            upcoming_events_data = BookingListingSerializer(upcoming_events, many=True).data

            upcoming_room_events = room_bookings.exclude(status=RoomBooking.STATUS_CANCELLED).order_by('check_in_date')[:3]
            upcoming_room_events_data = RoomBookingListingSerializer(upcoming_room_events, many=True).data

            data = {
                'total_halls': total_halls,
                'total_rooms': total_rooms,
                'occupancy_rate': occupancy_rate,
                'active_bookings': active_bookings,
                'total_revenue': total_revenue,
                'popular_halls': popular_halls_data,
                'popular_rooms': popular_rooms_data,
                'upcoming_events': upcoming_events_data,
                'upcoming_room_events': upcoming_room_events_data,
            }
            return Response(create_response(SUCCESSFUL, data), status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────────────────────────────
# REVENUE REPORT (HALL) (computed, read-only export)
# ─────────────────────────────────────────────────────────────────────
class RevenueReportView(APIView):
    permission_classes = (IsAuthenticated,)

    @permission_required([READ_REPORTS])
    def get(self, request):
        try:
            start_date = request.query_params.get('date_from')
            end_date = request.query_params.get('date_to')
            rows = revenue_report(start_date, end_date)

            data = [{
                'booking_code': r['booking_code'],
                'hall_name_en': r['hall__name_en'],
                'customer_name': r['customer__name_en'],
                'date': r['date'],
                'status': r['status'],
                'total': r['total'],
            } for r in rows]

            serialized = RevenueReportRowSerializer(data, many=True).data
            total_revenue = sum(r['total'] for r in data)
            return Response(create_response(SUCCESSFUL, {
                'rows': serialized,
                'total_revenue': total_revenue,
                'count': len(serialized),
            }), status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────────────────────────────
# REVENUE REPORT (ROOM) (computed, read-only export)
# ─────────────────────────────────────────────────────────────────────
class RoomRevenueReportView(APIView):
    permission_classes = (IsAuthenticated,)

    @permission_required([READ_REPORTS])
    def get(self, request):
        try:
            start_date = request.query_params.get('date_from')
            end_date = request.query_params.get('date_to')
            rows = room_revenue_report(start_date, end_date)

            data = [({
                'booking_code': r['booking_code'],
                'room_name_en': r['room__name_en'],
                'customer_name': r['customer__name_en'],
                'date': r['check_in_date'],
                'status': r['status'],
                'total': r['total'],
            } for r in rows)]

            serialized = RoomRevenueReportRowSerializer(data, many=True).data
            total_revenue = sum(r['total'] for r in data)
            return Response(create_response(SUCCESSFUL, {
                'rows': serialized,
                'total_revenue': total_revenue,
                'count': len(serialized),
            }), status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────────────────────────────
# CUSTOMER REPORT (computed, read-only export)
# ─────────────────────────────────────────────────────────────────────
class CustomerReportView(APIView):
    permission_classes = (IsAuthenticated,)

    @permission_required([READ_REPORTS])
    def get(self, request):
        try:
            start_date = request.query_params.get('date_from')
            end_date = request.query_params.get('date_to')
            rows = customer_report(start_date, end_date)

            data = [{
                'customer_name': r['customer__name_en'],
                'bookings_in_period': r['bookings_in_period'],
            } for r in rows]

            serialized = CustomerReportRowSerializer(data, many=True).data
            return Response(create_response(SUCCESSFUL, {
                'rows': serialized,
                'count': len(serialized),
            }), status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────────────────────────────
# PAYMENT
# ─────────────────────────────────────────────────────────────────────
class PaymentView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PaymentSerializer
    filterset_class = PaymentFilter
    list_serializer = PaymentListingSerializer

    @permission_required([CREATE_PAYMENT])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_PAYMENT])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_PAYMENT])
    def patch(self, request):
        return super().patch_(request)

    @permission_required([DELETE_PAYMENT])
    def delete(self, request):
        try:
            if request.query_params.get('id'):
                instance = self.serializer_class.Meta.model.objects.filter(
                    deleted=False, id=request.query_params.get('id', None)
                ).first()
                if instance:
                    instance.deleted = True
                    instance.save()
                    serialized_resp = self.serializer_class(instance).data
                    return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
                else:
                    return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────────────────────────────
# HALL PRICING
# ─────────────────────────────────────────────────────────────────────
class HallPricingView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = HallPricingSerializer
    filterset_class = HallPricingFilter
    list_serializer = HallPricingListingSerializer

    @permission_required([CREATE_HALL_PRICING])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_HALL_PRICING])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_HALL_PRICING])
    def patch(self, request):
        return super().patch_(request)

    @permission_required([DELETE_HALL_PRICING])
    def delete(self, request):
        try:
            if request.query_params.get('id'):
                instance = self.serializer_class.Meta.model.objects.filter(
                    deleted=False, id=request.query_params.get('id', None)
                ).first()
                if instance:
                    instance.deleted = True
                    instance.save()
                    serialized_resp = self.serializer_class(instance).data
                    return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
                else:
                    return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────────────────────────────
# ROOM PRICING
# ─────────────────────────────────────────────────────────────────────
class RoomPricingView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = RoomPricingSerializer
    filterset_class = RoomPricingFilter
    list_serializer = RoomPricingListingSerializer

    @permission_required([CREATE_ROOM_PRICING])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_ROOM_PRICING])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_ROOM_PRICING])
    def patch(self, request):
        return super().patch_(request)

    @permission_required([DELETE_ROOM_PRICING])
    def delete(self, request):
        try:
            if request.query_params.get('id'):
                instance = self.serializer_class.Meta.model.objects.filter(
                    deleted=False, id=request.query_params.get('id', None)
                ).first()
                if instance:
                    instance.deleted = True
                    instance.save()
                    serialized_resp = self.serializer_class(instance).data
                    return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
                else:
                    return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────────────────────────────
# BOOKING SERVICE
# ─────────────────────────────────────────────────────────────────────
class BookingServiceView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = BookingServiceSerializer
    filterset_class = BookingServiceFilter
    list_serializer = BookingServiceListingSerializer

    @permission_required([CREATE_BOOKING_SERVICE])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_BOOKING_SERVICE])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_BOOKING_SERVICE])
    def patch(self, request):
        return super().patch_(request)

    @permission_required([DELETE_BOOKING_SERVICE])
    def delete(self, request):
        try:
            if request.query_params.get('id'):
                instance = self.serializer_class.Meta.model.objects.filter(
                    deleted=False, id=request.query_params.get('id', None)
                ).first()
                if instance:
                    instance.deleted = True
                    instance.save()
                    serialized_resp = self.serializer_class(instance).data
                    return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
                else:
                    return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────────────────────────────
# HALL AMENITY
# ─────────────────────────────────────────────────────────────────────
class HallAmenityView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = HallAmenitySerializer
    filterset_class = HallAmenityFilter
    list_serializer = HallAmenityListingSerializer

    @permission_required([CREATE_HALL_AMENITY])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_HALL_AMENITY])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_HALL_AMENITY])
    def patch(self, request):
        return super().patch_(request)

    @permission_required([DELETE_HALL_AMENITY])
    def delete(self, request):
        try:
            if request.query_params.get('id'):
                instance = self.serializer_class.Meta.model.objects.filter(
                    deleted=False, id=request.query_params.get('id', None)
                ).first()
                if instance:
                    instance.deleted = True
                    instance.save()
                    serialized_resp = self.serializer_class(instance).data
                    return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
                else:
                    return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────────────────────────────
# ROOM AMENITY
# ─────────────────────────────────────────────────────────────────────
class RoomAmenityView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = RoomAmenitySerializer
    filterset_class = RoomAmenityFilter
    list_serializer = RoomAmenityListingSerializer

    @permission_required([CREATE_ROOM_AMENITY])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_ROOM_AMENITY])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_ROOM_AMENITY])
    def patch(self, request):
        return super().patch_(request)

    @permission_required([DELETE_ROOM_AMENITY])
    def delete(self, request):
        try:
            if request.query_params.get('id'):
                instance = self.serializer_class.Meta.model.objects.filter(
                    deleted=False, id=request.query_params.get('id', None)
                ).first()
                if instance:
                    instance.deleted = True
                    instance.save()
                    serialized_resp = self.serializer_class(instance).data
                    return Response(create_response(SUCCESSFUL, serialized_resp, 1), status=status.HTTP_200_OK)
                else:
                    return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(create_response(ID_NOT_PROVIDED), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)