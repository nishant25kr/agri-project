from django.urls import path
from . import views

app_name = 'disease'

urlpatterns = [
    path('', views.upload_image_api, name='disease_home'),
    path('upload/', views.upload_image_api, name='upload_image'),
    path('api/upload/', views.upload_image_api, name='api_upload'),
]