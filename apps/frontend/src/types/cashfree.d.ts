declare module '@cashfreepayments/cashfree-js' {
  interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget: "_modal" | "_blank" | "_self";
    onSuccess?: (data: { orderId: string }) => void;
    onFailure?: (data: { orderId: string }) => void;
  }

  interface Checkout {
    open: () => void;
  }

  interface Cashfree {
    checkout: (options: CheckoutOptions) => Promise<{ orderId: string }>;
  }

  export function load(options: { mode: "sandbox" | "production" }): Promise<Cashfree>;
} 