from django.urls import path
from . import views

urlpatterns = [
    path('', views.course_list, name='course_list'),
    path('<int:course_id>/', views.course_details, name='course_details'),
    path('enroll/<int:course_id>/', views.enroll_course, name='enroll_course'),
   

]




