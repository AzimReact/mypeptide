import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  email: z.email("Enter a valid email address"),
  firstName: z.string().min(1, "First name is required").max(80),
  lastName: z.string().min(1, "Last name is required").max(80),
  address: z.string().min(1, "Address is required").max(200),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  zip: z.string().min(3, "ZIP / postal code is required").max(20),
  country: z.string().min(1, "Country is required").max(100),
  ageConfirmed: z
    .boolean()
    .refine((v) => v === true, "You must confirm you are 21 or older"),
  researchUseConfirmed: z
    .boolean()
    .refine((v) => v === true, "You must confirm research/laboratory use only"),
  termsAccepted: z
    .boolean()
    .refine((v) => v === true, "You must accept the terms to continue"),
  items: z.array(cartItemSchema).min(1, "Your cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const checkoutFormSchema = checkoutSchema.omit({ items: true });
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const trackOrderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  email: z.email("Enter a valid email address"),
});

export type TrackOrderInput = z.infer<typeof trackOrderSchema>;

export const cryptoCurrencySchema = z.enum(["BTC", "ETH", "USDT", "USDC"]);
export type CryptoCurrency = z.infer<typeof cryptoCurrencySchema>;
