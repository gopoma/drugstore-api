const CartService = require("./cart");
const {
    stripeSecretKey,
    endpointSecret
} = require("../config");
const stripe = require("stripe")(stripeSecretKey);

class PaymentsService {
    async createStripeIntent(idUser, stripeCustomerID) {
        const cartService = new CartService();
        const result = await cartService.calculateCheckout(idUser);

        if(!result.success) {
            return {
                success: false,
                messages: result.messages
            };
        }

        const intent = await stripe.paymentIntents.create({
            amount: result.checkout,
            currency: "PEN",
            customer: stripeCustomerID
        });
        return {
            success: true,
            clientSecret: intent.client_secret
        };
    }

    async confirmStripe(data, signature) {
        let event;
        try {
            event = stripe.webhooks.constructEvent(data, signature, endpointSecret);
        } catch(error) {
            return {
                success: false,
                message: `Webhook Error: ${error.message}`
            };
        }

        switch(event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const stripeCustomerID = paymentIntent.customer;

                if(!stripeCustomerID) {
                    break;
                }
                const cartService = new CartService();
                const result = await cartService.resolveStripeClearout(stripeCustomerID);
                return result;
            }
            default: {
                console.log(`Unhandled event type ${event.type}`);
            }
        }

        return {
            success: true,
            message: "OK"
        };
    }
}

module.exports = PaymentsService;