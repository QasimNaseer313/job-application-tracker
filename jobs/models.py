from django.db import models
from django.contrib.auth.models import User


class JobApplication(models.Model):

    class Status(models.TextChoices):
        APPLIED = 'applied',   'Applied'
        INTERVIEW = 'interview', 'Interview'
        REJECTED = 'rejected',  'Rejected'
        OFFERED = 'offered',   'Offered'
        ACCEPTED = 'accepted',  'Accepted'

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='applications')
    company = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    job_url = models.URLField(blank=True, null=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.APPLIED)
    date_applied = models.DateField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.job_title} at {self.company} — {self.status}"
