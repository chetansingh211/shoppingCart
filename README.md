# Shopping Cart API

## Description

This is a sample shopping cart application built using Node.js and Express. The application provides a REST API for adding items to a shopping cart, applying promotions, and calculating the total price.


## Installation

1. Install dependencies

```bash
$ npm install
```

## Compile

```bash

$ npm run build
```

## Running the app

```bash
# development
$ npm run start

```

## Test

```bash
# run both unit and e2e tests
$ npm run test
```

## Documentation

This API is documented using Swagger, which provides a user-friendly interface for exploring the API endpoints and their parameters. You can access the Swagger documentation by following these steps:

Start the server by running npm start.

Open your web browser and navigate to http://localhost:3000/docs/

The Swagger documentation provides a comprehensive overview of the API endpoints, including their names, descriptions, parameter definitions, and response schemas. You can use the Swagger interface to test the API endpoints and see the responses in real time.

## POST /checkout

This endpoint processes a checkout request for the specified items in the request body. The request body should be an array of objects, where each object represents a product and its quantity. The objects should have the following properties:

1. Scanned item: MacBook Pro, Raspberry Pi B

```bash
Request

POST /checkout
Content-Type: application/json

[ 
  "MacBook Pro",
  "Raspberry Pi B"
]


Response

{
  "cartItems": [
    {
      "name": "MacBook Pro",
      "quantity": 1,
      "price": 5399.99
    },
    {
      "name": "Raspberry Pi B",
      "quantity": 1,
      "price": 30
    }
  ],
  "grossAmount": 5429.99,
  "discountAmount": 30,
  "totalAmount": 5399.99
}

```

2. Scanned item: Google Home, Google Home, Google Home

```bash
Request

POST /checkout
Content-Type: application/json

[ 
  "Google Home",
  "Google Home",
  "Google Home"
]


Response

{
  "cartItems": [
    {
      "name": "Google Home",
      "quantity": 3,
      "price": 49.99
    }
  ],
  "grossAmount": 149.97,
  "discountAmount": 49.99,
  "totalAmount": 99.98
}

```

3. Scanned item: Alexa Speaker, Alexa Speaker, Alexa Speaker

```bash

Request

POST /checkout
Content-Type: application/json

[ 
  "Alexa Speaker",
  "Alexa Speaker",
  "Alexa Speaker"
]

Response

{
  "cartItems": [
    {
      "name": "Alexa Speaker",
      "quantity": 3,
      "price": 109.5
    }
  ],
  "grossAmount": 328.5,
  "discountAmount": 32.85,
  "totalAmount": 295.65
}

```