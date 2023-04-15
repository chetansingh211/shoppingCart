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
const checkoutController_1 = require("./checkoutController");
describe('checkout', () => {
    const req = {
        params: {},
        query: {},
        cookies: {},
        signedCookies: {},
        headers: {},
        get: jest.fn(),
        path: '/checkout',
        route: {},
        originalUrl: '',
        protocol: '',
        secure: true,
        ip: '',
        ips: [],
        subdomains: [],
        xhr: false,
        connection: {},
        httpVersion: '',
        url: '',
        baseUrl: '',
        hostname: '',
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
        acceptsEncodings: jest.fn(),
        acceptsLanguages: jest.fn(),
        range: jest.fn(),
    };
    const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn(),
        sendStatus: jest.fn(),
        header: jest.fn(),
        setHeader: jest.fn(),
        getHeader: jest.fn(),
        cookie: jest.fn(),
        clearCookie: jest.fn(),
        redirect: jest.fn(),
        type: jest.fn(),
        format: jest.fn(),
        attachment: jest.fn(),
        download: jest.fn(),
        end: jest.fn(),
        locals: {}
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should return a 400 error if one or more items are not available in inventory', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = ['MacBook Pro', 'Invalid item'];
        yield (0, checkoutController_1.checkout)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ error: 'One or more items are not available in inventory.' });
    }));
    it('should calculate the correct total for MacBook Pro and Raspberry Pi B', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = ['MacBook Pro', 'Raspberry Pi B'];
        yield (0, checkoutController_1.checkout)(req, res);
        expect(res.json).toHaveBeenCalledWith({
            cartItems: [
                { name: 'MacBook Pro', quantity: 1, price: 5399.99 },
                { name: 'Raspberry Pi B', quantity: 1, price: 30 },
            ],
            grossAmount: 5429.99,
            discountAmount: 30,
            totalAmount: 5399.99,
        });
    }));
    it('should calculate the correct total for 3 Google Home devices', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = ['Google Home', 'Google Home', 'Google Home'];
        yield (0, checkoutController_1.checkout)(req, res);
        expect(res.json).toHaveBeenCalledWith({
            cartItems: [
                { name: 'Google Home', quantity: 3, price: 49.99 },
            ],
            grossAmount: 149.97,
            discountAmount: 49.99,
            totalAmount: 99.98,
        });
    }));
    it('should calculate the correct total for 3 Alexa Speakers', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = ['Alexa Speaker', 'Alexa Speaker', 'Alexa Speaker'];
        yield (0, checkoutController_1.checkout)(req, res);
        expect(res.json).toHaveBeenCalledWith({
            cartItems: [
                { name: 'Alexa Speaker', quantity: 3, price: 109.5 },
            ],
            grossAmount: 328.5,
            discountAmount: 32.85,
            totalAmount: 295.65,
        });
    }));
});
//# sourceMappingURL=checkoutController.test.js.map