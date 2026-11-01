/** Public build configuration. Never put secrets or personal contact details here. */
export const siteConfig = {
  status: "prelaunch",
  operator: "Kristian Salmeron",
  contact: {
    enabled: false,
    url: "",
  },
  checkout: {
    paymentsReady: false,
    repairAgreed: false,
    stripePaymentLink: "",
  },
} as const;
