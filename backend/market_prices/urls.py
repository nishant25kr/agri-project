from django.urls import path
from . import views

urlpatterns = [
    path('',               views.index,            name='market-index'),
    path('prices/',        views.get_prices,        name='market-prices'),
    path('commodities/',   views.get_commodities,   name='market-commodities'),
]
