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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// checkoutRouter.ts
const express_1 = __importDefault(require("express"));
const checkoutController_1 = require("./checkoutController");
const router = express_1.default.Router();
exports.router = router;
router.post('/checkout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, checkoutController_1.checkout)(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing checkout' });
    }
}));
//# sourceMappingURL=checkoutRouter.js.map