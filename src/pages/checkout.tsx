"use client";

// pages/checkout.js
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/router";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface CheckoutFormProps {
  sessionId: string;
  teacherId: string;
  amount: number;
  studentId: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  sessionId,
  teacherId,
  amount,
  studentId,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    const { clientSecret } = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherId,
        sessionId,
        amount,
        studentId,
      }),
    }).then((res) => res.json());

    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) ?? { token: "" },
      },
    });

    if (result.error) {
      setError(result?.error?.message ?? "An unknown error occurred");
      setLoading(false);
    } else if (result.paymentIntent.status === "succeeded") {
      setLoading(false);
      router.push(`/session/${sessionId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

const CheckoutPage = () => {
  const { query } = useRouter();

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        sessionId={query?.sessionId as string}
        teacherId={query?.teacherId as string}
        amount={+(query?.amount as string)}
        studentId={query?.studentId as string}
      />
    </Elements>
  );
};

export default CheckoutPage;
