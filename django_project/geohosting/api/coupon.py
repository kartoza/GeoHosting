from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from geohosting.models.coupon import CouponCode


class CheckPaystackCoupon(APIView):
    """Check if a paystack coupon is valid."""

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        """Check coupon validity."""
        coupon_code = request.data.get('coupon_code')
        if not coupon_code:
            return Response(
                {'detail': 'Coupon code is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        code = CouponCode.objects.filter(
            code=coupon_code,
            paystack_active=True
        ).first()
        if code:
            return Response(
                code.coupon.discount_text(),
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'detail': 'Coupon not found or inactive.'},
                status=status.HTTP_404_NOT_FOUND
            )
