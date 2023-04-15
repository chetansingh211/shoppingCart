"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = void 0;
const inventory = require('./data/inventory');
const promotions = require('./data/promotions');
// // calculate the gift items
function calculateGiftItems(cartItem, availableItems, giftItems) {
    const itemInventory = availableItems.filter((item) => item.name === cartItem.name);
    if (itemInventory.length === 0 || itemInventory.quantity < cartItem.quantity) {
        throw new Error('Inventory item not found or inventory does not have this much quantity...');
    }
    const promotion = promotions.filter((item) => item.sku === itemInventory[0].sku);
    if (promotion.length > 0) {
        if (promotion[0].giftSku) {
            const giftSku = promotion[0].giftSku;
            const giftQuantity = promotion[0].giftQuantity * cartItem.quantity;
            giftItems[giftSku] = giftItems[giftSku] ? giftItems[giftSku] + giftQuantity : giftQuantity;
        }
    }
}
function calculateDiscountWithBulkPurchase(promotion, quantity, price) {
    const boughtQuantity = Math.floor(quantity / promotion.bought_quantity) * promotion.discounted_quantity + quantity % promotion.bought_quantity;
    return (quantity - boughtQuantity) * price;
}
function calculateDiscountWithPercentage(promotion, quantity, price) {
    const itemAmount = quantity * price;
    return itemAmount * (promotion.discount_percent / 100);
}
// calculate the discount for gifts item
function calculateGiftDiscount(giftItems, inventory) {
    let discountAmount = 0;
    for (const giftSku in giftItems) {
        const giftQuantity = giftItems[giftSku];
        const itemInventory = inventory.filter((item) => item.sku === giftSku);
        const giftPrice = itemInventory[0].price;
        discountAmount += giftPrice * giftQuantity;
    }
    return discountAmount;
}
function checkout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const items = req.body;
        const giftItems = {};
        try {
            let grossAmount = 0;
            let discountAmount = 0;
            let totalAmount = 0;
            const cartItems = items.reduce((acc, item) => {
                const existingItemIndex = acc.findIndex((el) => el.name === item);
                if (existingItemIndex !== -1) {
                    acc[existingItemIndex].quantity++;
                }
                else {
                    acc.push({ name: item, quantity: 1 });
                }
                return acc;
            }, []);
            // Check if all items are available in inventory
            const availableItems = inventory.filter((item) => items.includes(item.name));
            if (availableItems.length !== cartItems.length) {
                res.status(400).send({ error: 'One or more items are not available in inventory.' });
                return;
            }
            cartItems.map((cartItem) => {
                let discount = 0;
                try {
                    calculateGiftItems(cartItem, availableItems, giftItems);
                }
                catch (error) {
                    res.status(500).json({ message: error.message });
                    return;
                }
                const itemInventory = availableItems.filter((item) => item.name === cartItem.name);
                if (itemInventory.length === 0 || itemInventory.quantity < cartItem.quantity) {
                    res.status(500).json({ message: 'Inventory item not found or inventory does not have this much quantity...' });
                }
                const itemPrice = itemInventory[0].price;
                const promotion = promotions.filter((item) => item.sku === itemInventory[0].sku);
                if (promotion.length > 0) {
                    if (promotion[0].discounted_quantity && promotion[0].bought_quantity) {
                        discount = calculateDiscountWithBulkPurchase(promotion[0], cartItem.quantity, itemPrice);
                    }
                    else if (promotion[0].discount_percent && promotion[0].bought_quantity && promotion[0].bought_quantity <= cartItem.quantity) {
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing checkout' });
        }
    });
}
exports.checkout = checkout;
//# sourceMappingURL=checkoutController.js.map