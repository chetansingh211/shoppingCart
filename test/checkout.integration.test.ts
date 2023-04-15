import request from 'supertest';
import app from '../src/app';

describe('Shopping Cart Integration tests', () => {
  it('should return a 400 error for an invalid request', async () => {
    const response = await request(app)
      .post('/checkout')
      .send(['MacBook Pro', 'Invalid Item']);
    
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'One or more items are not available in inventory.' });
  });

  it('should calculate the correct total for MacBook Pro and Raspberry Pi B', async () => {

    const response = await request(app)
    .post('/checkout')
    .send(['MacBook Pro', 'Raspberry Pi B']);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      cartItems: [
        { name: 'MacBook Pro', quantity: 1, price: 5399.99 },
        { name: 'Raspberry Pi B', quantity: 1, price: 30 },
      ],
      grossAmount: 5429.99,
      discountAmount: 30,
      totalAmount: 5399.99,
    });
  });

  it('should calculate the correct total for 3 Google Home devices', async () => {
    const response = await request(app)
    .post('/checkout')
    .send(['Google Home', 'Google Home', 'Google Home']);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      cartItems: [
        { name: 'Google Home', quantity: 3, price: 49.99 },
      ],
      grossAmount: 149.97,
      discountAmount: 49.99,
      totalAmount: 99.98,
    });
  });

  it('should calculate the correct total for 3 Alexa Speakers', async () => {
    const response = await request(app)
    .post('/checkout')
    .send(['Alexa Speaker', 'Alexa Speaker', 'Alexa Speaker']);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      cartItems: [
        { name: 'Alexa Speaker', quantity: 3, price: 109.5 },
      ],
      grossAmount: 328.5,
      discountAmount: 32.85,
      totalAmount: 295.65,
    });
  });
});
