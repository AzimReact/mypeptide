export interface FaqEntry {
  question: string;
  answer: string;
}

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    question: "Who can purchase from Axiom Research?",
    answer:
      "Our catalog is intended for qualified researchers, laboratories, and institutions purchasing reference compounds for lawful laboratory and research use only. By placing an order, you confirm the products will not be used for human or veterinary purposes.",
  },
  {
    question: "Does every product ship with documentation?",
    answer:
      "Yes. Every product listing includes a downloadable Certificate of Analysis (COA) and Safety Data Sheet (SDS) on its product page, so your team can review batch-level testing information before and after purchase.",
  },
  {
    question: "How is payment handled?",
    answer:
      "Checkout is completed using cryptocurrency (BTC, ETH, USDT, or USDC). After placing an order you'll be directed to a dedicated payment screen with a wallet address, QR code, and live countdown for that transaction window.",
  },
  {
    question: "How can I track an existing order?",
    answer:
      "Visit the Track Order page and enter your order number along with the email address used at checkout. You'll see current order status, payment status, and shipping details.",
  },
  {
    question: "What is your shipping policy?",
    answer:
      "Orders are processed after payment is confirmed and typically ship within 1–2 business days. See our Shipping Policy page for full details on carriers, timelines, and packaging.",
  },
  {
    question: "Can I request additional batch documentation?",
    answer:
      "Yes — reach out through our Contact page with your order number and the specific lot in question, and our team will provide any available supplementary documentation.",
  },
];
