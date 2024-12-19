import { PaymentDetails } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type PaymentDetailsStore = {
  paymentDetails: PaymentDetails | null;
  setPaymentDetails: (user: PaymentDetails | null) => void;
};

export const usePaymentDetailsStore = create<PaymentDetailsStore>()(
  persist(
    (set) => ({
      paymentDetails: null,
      setPaymentDetails: (paymentDetails) => set({ paymentDetails }),
    }),
    {
      name: "payment_details_storage",
      getStorage: () => localStorage,
    }
  )
);
