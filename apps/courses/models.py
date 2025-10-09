from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    enrolled_users = models.ManyToManyField(User, blank=True, related_name='enrolled_courses')

    def __str__(self):
        return self.title





