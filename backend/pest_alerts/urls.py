from django.urls import path
from . import views

app_name = 'pest_alerts'

urlpatterns = [
    path('', views.alerts, name='alerts'),
    path('get-alerts/', views.get_alerts, name='get_alerts'),
]

