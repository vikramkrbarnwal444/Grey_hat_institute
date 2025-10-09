from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import razorpay
from django.conf import settings

client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET_KEY))

from apps.courses.models import Course  # import your course model

# Razorpay client setup
client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET_KEY))


def pay_page(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    order_amount = int(course.price * 100)  # Convert to paisa
    order_currency = 'INR'
    
    payment_order = client.order.create(dict(amount=order_amount, currency=order_currency, payment_capture=1))
    payment_order_id = payment_order['id']
    
    context = {
        'course': course,
        'amount': course.price,
        'api_key': settings.RAZORPAY_API_KEY,
        'order_id': payment_order_id
    }
    return render(request, 'payments/payment_page.html', context)

@csrf_exempt
def handle_success(request):
    return render(request, 'payments/payment_success.html')


