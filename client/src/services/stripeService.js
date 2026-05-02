import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export const createPaymentIntent = async (amount, currency = 'inr') => {
  const response = await api.post('/payments/create-intent', { amount, currency });
  return response.data;
};