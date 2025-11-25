import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export class RazorpayService {
  async createOrder(amount: number, description: string) {
    try {
      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        description,
        notes: {
          timestamp: new Date().toISOString(),
        },
      });
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  async verifyPayment(paymentId: string, orderId: string, signature: string) {
    try {
      const crypto = await import('crypto');
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        throw new Error('Invalid payment signature');
      }

      return true;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }
}

export const razorpayService = new RazorpayService();
