from django.urls import path
from . import views

app_name = 'weather'

urlpatterns = [
    path('', views.index, name='index'),
    path('get-weather/', views.get_weather, name='get_weather'),
]