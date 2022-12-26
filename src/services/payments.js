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

        console.log(result.checkout);
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
}

module.exports = PaymentsService;