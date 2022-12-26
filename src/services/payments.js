const CartService = require("./cart");
const {stripeSecretKey} = require("../config");
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
            const endpointSecret = "whsec_9aa4651d39d59cdbcec5f2e4ac67fda35e6131a6908b86da5863130916f0514a";
            event = stripe.webhooks.constructEvent(data, signature, endpointSecret);
        } catch(error) {
            console.log(error.message);
            return {
                success: false,
                message: `Webhook Error: ${error.message}`
            };
        }

        if(event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;
            console.log(paymentIntent);
        } else {
            console.log(`Unhandled event type ${event.type}`);
        }

        return {
            success: true,
            message: "OK"
        };
    }
}

module.exports = PaymentsService;