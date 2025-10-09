from django.urls import path
from . import views

app_name = 'payment'

urlpatterns = [
    path('<int:course_id>/', views.pay_page, name='payment_page'),
    path('success/', views.handle_success, name='payment_success'),
]


