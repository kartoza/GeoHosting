"""Checkout API."""

import io
import json

from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.http import HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from weasyprint import HTML

from geohosting.api.payment import (
    PaymentAPI, PaymentStripeSessionAPI, PaymentPaystackSessionAPI
)
from geohosting.models import Package
from geohosting.models.agreement import AgreementDetail, SalesOrderAgreement
from geohosting.models.company import Company
from geohosting.models.sales_order import SalesOrder
from geohosting.validators import name_validator, app_name_validator


def create_agreement(html_content, agreement_id, order):
    """Create pdf from html."""
    # Wrap with full HTML if needed
    full_html = f"""
    <html>
        <head>
            <style>
                @page {{
                    size: A4;
                    margin: 4rem; 
                }}
                body {{
                    margin: 0;
                    padding: 0;
                    font-family: Lato, sans-serif;
                }}
              table {{ width: 100%; border-collapse: collapse; }}
              th, td {{ border: 1px solid #eee; padding: 6px; }}
              hr {{ border: 1px solid #eaeaea; height: 0; }}
              img {{ width: 100%; }}
            </style>
        </head>
        <body>{html_content}</body>
    </html>
    """

    pdf_io = io.BytesIO()
    HTML(string=full_html).write_pdf(pdf_io)
    pdf_io.seek(0)

    # Save to model
    sales_order = SalesOrderAgreement.objects.create(
        agreement_detail=AgreementDetail.objects.get(pk=agreement_id),
        sales_order=order
    )
    sales_order.file.save(
        f"{sales_order.name}.pdf", ContentFile(pdf_io.read())
    )
    sales_order.save()


class CheckoutAPI(PaymentAPI):
    """API checkout session."""

    def post(self, request, pk):
        """Post to create checkout session."""
        try:
            app_name = request.data['app_name']
            company_name = request.data['company_name']
            agreement_ids = json.loads(request.data['agreement_ids'])
            if company_name:
                company = Company.objects.get(name=company_name)
            else:
                company = None
            name_validator(app_name)
            app_name_validator(app_name)
        except (ValueError, ValidationError) as e:
            return HttpResponseBadRequest(e)
        package = get_object_or_404(Package, pk=pk)

        # Create order
        order = SalesOrder.objects.create(
            package=package,
            customer=request.user,
            app_name=app_name,
            company=company,
            payment_method=self.payment_method
        )
        for agreement_id in agreement_ids:
            create_agreement(
                request.data[f'agreement-{agreement_id}'], agreement_id, order
            )
        return self.get_post(order=order)


class CheckoutStripeSessionAPI(PaymentStripeSessionAPI, CheckoutAPI):
    """API creating stripe checkout session."""

    pass


class CheckoutPaystackSessionAPI(PaymentPaystackSessionAPI, CheckoutAPI):
    """API creating paystack checkout session."""

    pass
