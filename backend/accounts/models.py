from django.db import models


class User(models.Model):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    code_hash = models.CharField(max_length=128)  # hashed 6-digit login code
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "users"


class Checkout(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    shipping_address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "checkouts"
