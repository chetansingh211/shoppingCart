// checkoutController.ts
import { Request, Response } from 'express';
const inventory = require('./data/inventory');
const promotions = require('./data/promotions');

interface GiftItems {
  [giftSku: string]: number;
}

interface Promotion {
  sku?: string;
  giftSku?: string;
  giftQuantity?: number;
  discounted_quantity?: number;
  discount_percent?: number;
  bought_quantity?: number;  
}

// // calculate the gift items
function calculateGiftItems(cartItem: any, availableItems: any, giftItems: GiftItems): void {
  const itemInventory = availableItems.filter((item: any) => item.name === cartItem.name);
  if (itemInventory.length === 0 || itemInventory.quantity < cartItem.quantity) {
    throw new Error('Inventory item not found or inventory does not have this much quantity...');
  }
  const promotion: Array<Promotion> = promotions.filter((item: any) => item.sku === itemInventory[0].sku);
  if (promotion.length > 0) {
    if (promotion[0].giftSku) {
      const giftSku = promotion[0].giftSku;
      const giftQuantity = promotion[0].giftQuantity! * cartItem.quantity;
      giftItems[giftSku] = giftItems[giftSku] ? giftItems[giftSku] + giftQuantity : giftQuantity;
    }
  }
}

function calculateDiscountWithBulkPurchase(promotion: Promotion, quantity: number, price: number): number {
  const boughtQuantity = Math.floor(quantity / promotion.bought_quantity!) * promotion.discounted_quantity! + quantity % promotion.bought_quantity!;
  return (quantity - boughtQuantity) * price;
}

function calculateDiscountWithPercentage(promotion: Promotion, quantity: number, price: number): number {
  const itemAmount = quantity * price;
  return itemAmount * (promotion.discount_percent! / 100);
}

// calculate the discount for gifts item
function calculateGiftDiscount(giftItems: GiftItems, inventory: any): number {
  let discountAmount = 0;
  for (const giftSku in giftItems) {
    const giftQuantity = giftItems[giftSku];
    const itemInventory = inventory.filter((item: any) => item.sku === giftSku);
    const giftPrice = itemInventory[0].price;
    discountAmount += giftPrice * giftQuantity;
  }
  return discountAmount;
}


async function checkout(req: Request, res: Response): Promise<void> {
  const items = req.body;
  const giftItems: GiftItems = {};

  try {
    let grossAmount = 0;
    let discountAmount: number = 0;
    let totalAmount: number = 0;

    const cartItems = items.reduce((acc: any, item: any) => {
      const existingItemIndex = acc.findIndex((el: any) => el.name === item);

      if (existingItemIndex !== -1) {
        acc[existingItemIndex].quantity++;
      } else {
        acc.push({ name: item, quantity: 1 });
      }
      return acc;
    }, []);

    // Check if all items are available in inventory
    const availableItems = inventory.filter((item: any) => items.includes(item.name));
    if (availableItems.length !== cartItems.length) {
      res.status(400).send({ error: 'One or more items are not available in inventory.' });
      return;
    }
    
    cartItems.map((cartItem: any) => {
      let discount: number = 0;
      try {
        calculateGiftItems(cartItem, availableItems, giftItems);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
        return;
      }

      const itemInventory = availableItems.filter((item: any) => item.name === cartItem.name);
      if (itemInventory.length === 0 || itemInventory.quantity < cartItem.quantity) {
        res.status(500).json({ message: 'Inventory item not found or inventory does not have this much quantity...' });
      }
      const itemPrice = itemInventory[0].price;

      const promotion: Array<Promotion> = promotions.filter((item: any) => item.sku === itemInventory[0].sku);
      if (promotion.length > 0) {
        if (promotion[0].discounted_quantity && promotion[0].bought_quantity) {
          discount = calculateDiscountWithBulkPurchase(promotion[0], cartItem.quantity, itemPrice);
        } else if (promotion[0].discount_percent && promotion[0].bought_quantity && promotion[0].bought_quantity <= cartItem.quantity) {
          discount = calculateDiscountWithPercentage(promotion[0], cartItem.quantity, itemPrice);
        }
      }
      grossAmount += cartItem.quantity * itemPrice;
      discountAmount += discount;
      cartItem.name = itemInventory[0].name;
      cartItem.price = itemInventory[0].price;
    });
    

    const giftDiscount = calculateGiftDiscount(giftItems, inventory);
    discountAmount += giftDiscount;

    totalAmount = +parseFloat((grossAmount - discountAmount).toFixed(2));

    res.json({ cartItems, grossAmount, discountAmount, totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing checkout' });
  }
}

export { checkout };
