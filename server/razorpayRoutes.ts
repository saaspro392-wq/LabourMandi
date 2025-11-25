import type { Express, Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export function registerRazorpayRoutes(app: Express) {
  // POST /api/payment/order - Create Razorpay order
  app.post("/api/payment/order", async (req: Request, res: Response) => {
    try {
      const { amount, description } = req.body;

      if (!amount || amount < 100) {
        return res.status(400).json({ error: "Minimum amount is ₹100" });
      }

      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        description,
        notes: { timestamp: new Date().toISOString() },
      });

      res.json({ orderId: order.id, key: process.env.RAZORPAY_KEY });
    } catch (error: any) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // POST /api/payment/verify - Verify Razorpay payment
  app.post("/api/payment/verify", async (req: Request, res: Response) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET!)
        .update(body)
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        res.json({ verified: true, message: "Payment verified successfully" });
      } else {
        res.status(400).json({ error: "Invalid signature" });
      }
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // GET /api/wallet/balance - Get wallet balance
  app.get("/api/wallet/balance", async (req: Request, res: Response) => {
    try {
      // TODO: Get from Firestore based on user ID
      res.json({ balance: 0 });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch balance" });
    }
  });
}
