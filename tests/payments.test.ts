import assert from "node:assert/strict";
import test from "node:test";
import { getApprovedPaymentLink } from "../src/payments.ts";
import { siteConfig } from "../src/config.ts";

const candidate = {
  paymentsReady: true,
  repairAgreed: true,
  stripePaymentLink: "https://buy.stripe.com/abc123XYZ",
};

test("ships with contact and checkout closed", () => {
  assert.equal(siteConfig.status, "prelaunch");
  assert.equal(siteConfig.contact.enabled, false);
  assert.equal(siteConfig.contact.url, "");
  assert.equal(getApprovedPaymentLink(siteConfig.checkout), null);
});

test("requires both payment readiness and an explicitly agreed repair", () => {
  assert.equal(
    getApprovedPaymentLink({ ...candidate, paymentsReady: false }),
    null,
  );
  assert.equal(
    getApprovedPaymentLink({ ...candidate, repairAgreed: false }),
    null,
  );
});

test("accepts a narrowly validated live Stripe URL for private handoff", () => {
  assert.equal(getApprovedPaymentLink(candidate), candidate.stripePaymentLink);
});

test("rejects malformed, deceptive, unsafe, and test checkout links", () => {
  for (const stripePaymentLink of [
    "",
    "javascript:alert(1)",
    "http://buy.stripe.com/abc",
    "https://buy.stripe.com.evil.example/abc",
    "https://evil.example/buy.stripe.com/abc",
    "https://buy.stripe.com@evil.example/abc",
    "https://user:secret@buy.stripe.com/abc",
    "https://buy.stripe.com:8080/abc",
    "https://buy.stripe.com/",
    "https://buy.stripe.com/test_abc",
    "https://buy.stripe.com/abc#fragment",
    "https://buy.stripe.com/abc?prefilled_email=personal@example.com",
    "https://checkout.stripe.com/abc",
    "//buy.stripe.com/abc",
  ]) {
    assert.equal(
      getApprovedPaymentLink({ ...candidate, stripePaymentLink }),
      null,
      stripePaymentLink,
    );
  }
});
