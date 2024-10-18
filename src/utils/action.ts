"use server"

import { Stripe } from "stripe"
import { stripe } from "./stripe"

interface StripeCheckoutProps {
  email: string
  companyId: string
  companyName: string
  path: string
}

export const StripeCheckout = async ({
  email,
  companyId,
  companyName,
  path
}: StripeCheckoutProps): Promise<string | void> => {
  if (!email || !companyId || !companyName) {
    return
  }

  try {
    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: path,
        cancel_url: path,
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        customer_email: email,
        metadata: {
          companyId
        },

        custom_fields: [
          {
            key: "company_name",
            label: {
              type: "custom",
              custom: "Company Name"
            },
            type: "text",
            text: {
              default_value: companyName
            }
          }
        ],

        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID!,
            quantity: 1
          }
        ]
      })

    return session.url as string
  } catch (error) {
    console.error("Error creating Stripe checkout session", error)
    throw new Error("Unable to create Stripe checkout session")
  }
}
