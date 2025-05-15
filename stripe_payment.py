import stripe
import os
from flask import Blueprint, request, jsonify, redirect

stripe_bp = Blueprint("stripe", __name__, url_prefix="/api/stripe")

# Configure Stripe API key. In a real app, use environment variables.
# For this example, I'll use a placeholder. Replace with your actual secret key.
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_YOUR_STRIPE_SECRET_KEY") 
# The frontend URL will be needed for success and cancel URLs
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000") # Assuming React runs on port 3000

@stripe_bp.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        # In a real application, you might pass product details or a price ID
        # For simplicity, we'll use a fixed price here (R$ 15.00 = 1500 cents)
        # The `pdf_data` or a `resume_id` could be passed in metadata to link the payment to the resume
        payload = request.json
        resume_data_for_metadata = payload.get("resumeData", {})
        template_id_for_metadata = payload.get("templateId", "default")

        # Create a new Checkout Session
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "brl",
                        "product_data": {
                            "name": "Currículo Profissional PDF",
                            "description": f"Download do seu currículo profissional (Template: {template_id_for_metadata})",
                        },
                        "unit_amount": 1500,  # R$ 15.00 em centavos
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url=f"{FRONTEND_URL}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/payment-cancelled",
            metadata={
                # You can store resume_id or other identifiers here
                "user_email": resume_data_for_metadata.get("email", "unknown_user")
            }
        )
        return jsonify({"id": session.id})
    except Exception as e:
        print(f"Stripe error: {e}")
        return jsonify(error=str(e)), 403

# This endpoint is optional: you might want to verify the session status after success
@stripe_bp.route("/checkout-session/<session_id>", methods=["GET"])
def get_checkout_session(session_id):
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        # Here you could check session.payment_status == "paid"
        # And then fulfill the order (e.g., grant access to PDF download, send email)
        return jsonify(session)
    except Exception as e:
        return jsonify(error=str(e)), 403

# A webhook endpoint is the most robust way to handle payment success asynchronously
# This is a basic placeholder and would require more setup (e.g., verifying webhook signature)
@stripe_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")
    # In a real app, use your webhook secret: os.getenv("STRIPE_WEBHOOK_SECRET")
    webhook_secret = "whsec_YOUR_WEBHOOK_SECRET" 
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        # Invalid payload
        return jsonify(error=str(e)), 400
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return jsonify(error=str(e)), 400

    # Handle the event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        # session_id = session.id
        # payment_status = session.payment_status
        # client_reference_id = session.client_reference_id (if you set it)
        # metadata = session.metadata
        print(f"Payment for session {session.id} succeeded!")
        # Fulfill the purchase (e.g., send email with PDF link, update database)
        # For this app, the frontend will handle the immediate download on success_url redirect.
        # But a webhook is good for backend fulfillment logic like sending emails.

    elif event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        print(f"PaymentIntent {payment_intent.id} succeeded!")
        # Handle successful payment intent

    # ... handle other event types
    else:
        print(f"Unhandled event type {event['type']}")

    return jsonify(received=True)


