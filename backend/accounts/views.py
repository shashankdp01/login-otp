import secrets
from django.contrib.auth.hashers import check_password, make_password
from django.core import signing
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Checkout, User
from .serializers import CheckoutSerializer, RegisterSerializer, VerifySerializer

SALT = "otp-login"
TOKEN_MAX_AGE = 60 * 60 * 24


def user_from_request(request):
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None
    try:
        data = signing.loads(header[7:], salt=SALT, max_age=TOKEN_MAX_AGE)
    except signing.BadSignature:
        return None
    return User.objects.filter(pk=data["uid"]).first()


@api_view(["POST"])
def register(request):
    s = RegisterSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    code = f"{secrets.randbelow(10**6):06d}"
    user = User.objects.create(**s.validated_data, code_hash=make_password(code))
    # The plain code is returned once; only its hash is stored.
    return Response({"code": code, "first_name": user.first_name}, status=201)


@api_view(["GET"])
def recognize(request):
    email = request.query_params.get("email", "").strip().lower()
    return Response({"registered": User.objects.filter(email=email).exists()})


@api_view(["POST"])
def verify(request):
    s = VerifySerializer(data=request.data)
    s.is_valid(raise_exception=True)
    user = User.objects.filter(email=s.validated_data["email"]).first()
    if not user or not check_password(s.validated_data["code"], user.code_hash):
        return Response({"error": "That code doesn't match. Check it and try again."}, status=400)
    token = signing.dumps({"uid": user.pk}, salt=SALT)
    return Response({"token": token, "email": user.email,
                     "first_name": user.first_name, "last_name": user.last_name})


@api_view(["POST"])
def checkout(request):
    user = user_from_request(request)
    if not user:
        return Response({"error": "Sign in to place your order."}, status=401)
    s = CheckoutSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    if s.validated_data["email"] != user.email:
        return Response({"error": "The email must match the account you're signed in with."}, status=403)
    order = Checkout.objects.create(user=user, **s.validated_data)
    return Response({"id": order.pk}, status=201)


# Per-endpoint rate limits (see REST_FRAMEWORK in settings).
recognize.cls.throttle_scope = "recognize"
verify.cls.throttle_scope = "verify"
