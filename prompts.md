

## Build the Project

```text
I want a simple account-based checkout app. Please look through this workspace first, then build the app to fit its existing structure and explain any assumptions you need to make.

Use React with Vite for the frontend, Django REST Framework for the JSON API, and PostgreSQL in production. Locally, the backend should use SQLite when DATABASE_URL isn't set. Keep the implementation straightforward and use environment variables for secrets and deployment settings.

The checkout should work like a normal guest flow: people can browse to checkout and enter their shipping details without signing in. Only ask them to sign in when they press Place order. The sign-in dialog should accept their email and six-digit account code, and give new users a clear way to create an account. Keep their shipping details if they move between checkout, sign-in, and account creation. After a successful sign-in or signup, take them back to checkout. Signup asks for email, first name, and last name; show the generated code once so the user can save it, then sign the new user in. This project records shipping details only; it doesn't take payment.

Please use these API routes: POST /api/register/ creates an account and returns a six-digit code; GET /api/recognize/?email=... returns whether an email is registered; POST /api/verify/ checks an email and code and returns a signed bearer token and user details; POST /api/checkout/ saves the email, phone, and shipping address. Checkout must require a valid token and the submitted email must match the signed-in account. Store only a password hash of the code. Normalize email addresses, validate phone numbers on the server, and save them in E.164 format (assume India when no country code is supplied). Signed tokens should expire after 24 hours, and recognition and verification should be rate limited.

Use Django migrations for the models and keep db/schema.sql in sync. Make sure forms have useful validation and error messages, loading and success states, accessible labels and dialogs, and work on mobile screens. Don't prompt for sign-in just because someone typed an email.

Document setup, the API, environment variables, and deployment in README.md. Include an example frontend environment file without real secrets. Add focused tests, run the frontend build and Django checks/tests, and tell me what you ran. Don't add an email/SMS provider, payment processing, or unrelated features. In this prototype the generated code is returned by the API and displayed to the user; call that out in the docs rather than implying it was emailed.
```

## Work on the Frontend

```text
Please inspect the existing React/Vite app and improve the checkout and account flow without changing the backend API.

Guests should be able to fill out checkout without being interrupted. Open the sign-in dialog only after they choose Place order. Include email and six-digit code fields, plus a Create account option. Keep a direct Sign in action in the navigation. After someone signs in or creates an account, return them to checkout and keep any shipping details they already entered. New accounts should be authenticated after signup, and the generated code should be shown once so the user can save it.

Keep the interface consistent with the existing project, responsive, and keyboard accessible. Include clear validation, loading, and API error states. Don't trigger sign-in just because an email was typed. Please run the Vite production build when you're done and summarize the changes.
```

## Work on the Backend

```text
Please review the existing Django REST Framework API and implement or tighten the OTP registration, sign-in, and checkout behavior.

Keep the routes POST /api/register/, GET /api/recognize/, POST /api/verify/, and POST /api/checkout/. Registration should return a six-digit code once and store only its hash. Verification should issue a Django-signed bearer token that expires after 24 hours. Checkout must require that token, and the checkout email must match the signed-in user's email. Normalize email addresses, validate phone numbers server-side, and store phones in E.164 format, using India as the default region when no country code is given. Rate limit email recognition and code verification.

Use SQLite when DATABASE_URL is unset and PostgreSQL when it is configured. If you change a model, update its migration and db/schema.sql as well. Add tests for the main success and failure cases, then run Django's checks and test suite. Don't add an email/SMS service or payment processing unless I ask for it.
```

## Review the Flow

```text
Could you walk through this project and check whether its guest checkout and OTP sign-in behave as intended? Please inspect the code first, call out any concrete problems, and fix only issues you can reproduce or clearly verify.

Check that guests aren't prompted while typing, Place order opens sign-in, sign-in offers account creation, and a successful login or signup returns to checkout without losing shipping details. Check that the API rejects checkout without a valid token or with an email that doesn't match the account. Also look at code hashing, token expiry, rate limits, phone normalization, and validation errors.

Please check the setup and deployment instructions too. Run the frontend build, backend tests, and Django checks that are available, then summarize what you found, changed, and couldn't verify.
```

