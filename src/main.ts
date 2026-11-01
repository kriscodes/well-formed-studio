import "./style.css";
import { siteConfig } from "./config.ts";
import { getApprovedPaymentLink } from "./payments.ts";

const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
const navigation = document.querySelector<HTMLElement>("#site-navigation");

function closeMenu() {
  toggle?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("is-open");
}

toggle?.addEventListener("click", () => {
  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!isOpen));
  navigation?.classList.toggle("is-open", !isOpen);
});

navigation
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    toggle?.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    toggle.focus();
  }
});
window.matchMedia("(min-width: 761px)").addEventListener("change", closeMenu);

// Fail closed. Public checkout stays unavailable even if a valid link is configured.
// Use the validator only in a separately reviewed, approved-repair handoff flow.
const approvedPaymentLink = getApprovedPaymentLink(siteConfig.checkout);
document.documentElement.dataset.launchStatus = siteConfig.status;
document.documentElement.dataset.checkoutStatus = approvedPaymentLink
  ? "private-only"
  : "unavailable";

const operator = document.querySelector<HTMLElement>("[data-operator]");
if (operator) operator.textContent = siteConfig.operator;
