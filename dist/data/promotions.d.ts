declare const promotions: ({
    sku: string;
    giftSku: string;
    giftQuantity: number;
    discounted_quantity: null;
    discount_percent: null;
    bought_quantity: null;
} | {
    sku: string;
    giftSku: null;
    giftQuantity: null;
    discounted_quantity: number;
    discount_percent: null;
    bought_quantity: number;
} | {
    sku: string;
    giftSku: null;
    giftQuantity: null;
    discounted_quantity: null;
    discount_percent: number;
    bought_quantity: number;
})[];
