export interface ApprovedRepairCheckout {
  /** Set only after business/payment setup is complete and reviewed. */
  paymentsReady: boolean;
  /** Operator confirmation for one particular repair; never inferred from a click. */
  repairAgreed: boolean;
  stripePaymentLink: string;
}

/**
 * Validate an external Stripe Payment Link for a privately agreed repair.
 * This is configuration validation, not authentication or proof of agreement.
 * The public marketing page deliberately never renders the returned URL.
 */
export function getApprovedPaymentLink(
  config: ApprovedRepairCheckout,
): string | null {
  if (!config.paymentsReady || !config.repairAgreed) return null;

  try {
    const url = new URL(config.stripePaymentLink);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "buy.stripe.com" ||
      url.username !== "" ||
      url.password !== "" ||
      url.port !== "" ||
      url.hash !== "" ||
      !/^\/[A-Za-z0-9]+$/.test(url.pathname) ||
      url.pathname.startsWith("/test_")
    )
      return null;
    // Keep this validator narrow. Customer metadata belongs in Stripe, not here.
    if (url.search !== "") return null;
    return url.href;
  } catch {
    return null;
  }
}
