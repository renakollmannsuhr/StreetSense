from django.shortcuts import render
from rest_framework import viewsets
from .models import CrimeReport
from .serializers import CrimeReportSerializer

class CrimeReportViewSet(viewsets.ModelViewSet):
    queryset = CrimeReport.objects.all()
    serializer_class = CrimeReportSerializer

# Create your views here.
