import phonenumbers
from rest_framework import serializers
from .models import User


class NormalizedEmail(serializers.EmailField):
    def to_internal_value(self, data):
        return super().to_internal_value(data).strip().lower()


class RegisterSerializer(serializers.Serializer):
    email = NormalizedEmail()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value


class VerifySerializer(serializers.Serializer):
    email = NormalizedEmail()
    code = serializers.RegexField(r"^\d{6}$", error_messages={"invalid": "Enter the 6-digit code."})


class CheckoutSerializer(serializers.Serializer):
    email = NormalizedEmail()
    phone = serializers.CharField()
    shipping_address = serializers.CharField(max_length=500)

    def validate_phone(self, value):
        msg = "Enter a valid phone number: 10 digits, or include the country code (+…)."
        try:
            number = phonenumbers.parse(value.strip(), "IN")  # default region: India
        except phonenumbers.NumberParseException:
            raise serializers.ValidationError(msg)
        if not phonenumbers.is_valid_number(number):
            raise serializers.ValidationError(msg)
        return phonenumbers.format_number(number, phonenumbers.PhoneNumberFormat.E164)
