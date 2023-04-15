// checkoutRouter.ts
import express, { Request, Response } from 'express';
import { checkout } from './checkoutController';

const router = express.Router();

router.post('/checkout', async (req: Request, res: Response) => {
  try {
    await checkout(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing checkout' });
  }
});

export { router };
