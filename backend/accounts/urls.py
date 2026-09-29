from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register),
    path("recognize/", views.recognize),
    path("verify/", views.verify),
    path("checkout/", views.checkout),
]
