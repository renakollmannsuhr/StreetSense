from django.db import models

class CrimeReport(models.Model):
    title = models.CharField(max_length=100)
    type = models.TextField(default='Other')
    description = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    date_reported = models.DateTimeField(auto_now_add=True)
    date_occurred = models.DateTimeField(default=None, blank=True, null=True)

    def __str__(self):
        return self.title
