import { prisma } from "@/lib/prisma"
import { stripe } from "@/utils/stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`)
        console.log("PaymentIntent Metadata:", paymentIntent.metadata)
        break

      // case "payment_intent.created":
      //   const paymentIntentCreated = event.data.object as Stripe.PaymentIntent
      // console.log("Payment created =====> :", paymentIntentCreated)
      // console.log(
      //   "PaymentIntent Created Metadata =====>",
      //   paymentIntentCreated.metadata
      // )

      // case "charge.updated":
      //   const charge = event.data.object as Stripe.Charge
      //   console.log("Charge ===>", charge)
      //   console.log("Charge Metadata:", charge.metadata)
      //   break

      case "checkout.session.completed":
        const sessionComplete = event.data.object
        // console.log("Session ===>", sessionComplete)

        const companyName = sessionComplete.custom_fields[0].text
          ?.value as string

        const Cardname = sessionComplete.customer_details?.name as string

        const paymentId = sessionComplete.id as string

        const email = sessionComplete.customer_email

        const companyId = sessionComplete.metadata?.companyId

        const payment = await prisma.payment.create({
          data: {
            CompanyName: companyName,
            Name: Cardname,
            paymentId: paymentId,
            companyId: companyId
          }
        })

        break

      default:
        console.log(`Unhandled event type ${event.type}.`)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Webhook handler failed" })
  }
}
