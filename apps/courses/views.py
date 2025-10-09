from django.shortcuts import render, get_object_or_404, redirect
from .models import Course
from django.contrib.auth.decorators import login_required

def course_list(request):
    courses = Course.objects.all()
    return render(request, 'courses/course_list.html', {'courses': courses})

def course_details(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    return render(request, 'courses/course_details.html', {'course': course})

@login_required
def enroll_course(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    
    # Here you should handle enrollment logic
    # For example, if you have a ManyToManyField `enrolled_users` in Course model:
    if request.user not in course.enrolled_users.all():
        course.enrolled_users.add(request.user)
    
    message = f"You have successfully enrolled in {course.title}!"
    return render(request, 'courses/enroll_success.html', {'course': course, 'message': message})

    