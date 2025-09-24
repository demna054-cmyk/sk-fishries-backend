import Stripe from "stripe";

// const secretKey = 'sk_test_51P1xBMKfmZjg6JS8A7fmT7EUDeJDx05yHxmyMxbRP8Rbad25CunbY2j5zeTgBqXXM2FGjcfVE6nQLjsRjRSTDY30003EK6wyZM'; // Replace 'API Key' with your actual Stripe secret key

//Last Updated 04 - June - 2024
// const secretKey = 'sk_test_51N6z0WCSqEAeQmco5oYdduocrsMEG55iW5qXyz9rB9X0MAFUM7mgZlKN0jeGemUJrIIYlAentHB2P9UDSUisLRrF00tMByKHA3'; // Replace 'API Key' with your actual Stripe secret key
const secretKey =
  "sk_test_51P1xBMKfmZjg6JS8A7fmT7EUDeJDx05yHxmyMxbRP8Rbad25CunbY2j5zeTgBqXXM2FGjcfVE6nQLjsRjRSTDY30003EK6wyZM"; // Replace 'API Key' with your actual Stripe secret key

const stripe = new Stripe(secretKey);

export const paymentIntent = stripe.paymentIntents.create({
  amount: 1000,
  currency: "USD",
  customer: "customer12", // Make sure customerId is defined before using it
});

paymentIntent
  .then(function (response) {
    console.log("Payment Successful", response);
  })
  .catch(function (error) {
    console.error("Payment Error", error);
    // There was an error processing the payment.
  });
