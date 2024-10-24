from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from reports.views import CrimeReportViewSet

router = routers.DefaultRouter()
router.register(r'reports', CrimeReportViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]