from django.shortcuts import render
from apps.courses.models import Course
def index(request):
    courses = Course.objects.all()
    available = courses.exists()  # agar course available hai
    return render(request, 'core/index.html', {'courses': courses, 'available': available})


def about(request):
    return render(request, 'core/about.html')

def contact(request):
    return render(request, 'core/contact.html')

