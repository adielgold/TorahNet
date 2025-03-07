"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter
import { Button } from "@/components/ui/button";

export default function PayPalConnect() {
  const router = useRouter(); // Initialize useRouter
  const [connectUrl, setConnectUrl] = useState("");
  const [status, setStatus] = useState("NOT_ONBOARDED");
  const [merchantId, setMerchantId] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    const checkSellerStatus = async () => {
      try {
        const merchantId = router.query.merchantId; // Get merchantId from query params

        if (merchantId) {
          const response = await fetch(
            `/api/paypal/onboarding/seller-status?merchantId=${merchantId}`,
            {
              method: "GET", // Use GET instead of POST
            },
          );

          const data = await response.json();
          setStatus(data.status);
          console.log("seller status API", data);
          if (data.merchantId) {
            setMerchantId(data.merchantId);
          }
        }
      } catch (error) {
        console.error("Failed to check seller status:", error);
      }
    };

    checkSellerStatus();
  }, [router.query.merchantId]); // Ensure it runs when merchantId changes

  // Get connect URL if not onboarded
  useEffect(() => {
    if (status === "NOT_ONBOARDED") {
      const initPayPalConnect = async () => {
        try {
          const response = await fetch("/api/paypal/onboarding/connect", {
            method: "POST",
          });
          const data = await response.json();
          if (data.url) {
            setConnectUrl(data.url);
          }
        } catch (error) {
          console.error("Failed to get PayPal connect URL:", error);
        }
      };

      initPayPalConnect();
    }
  }, [status]);

  const handleConnectClick = () => {
    if (connectUrl) {
      window.location.href = connectUrl; // Redirect in the same window
    }
  };

  return (
    <div>
      {status === "ACTIVE" ? (
        <div className="text-green-600">
          PayPal account connected!
          {merchantId && (
            <div className="text-sm">Merchant ID: {merchantId}</div>
          )}
        </div>
      ) : status === "PENDING" ? (
        <div className="text-yellow-600">PayPal onboarding in progress...</div>
      ) : connectUrl ? (
        <Button onClick={handleConnectClick} className="mt-2">
          Connect with PayPal
        </Button>
      ) : null}
    </div>
  );
}
