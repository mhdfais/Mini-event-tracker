"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventController_1 = require("../controller/eventController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public route
router.get('/share/:shareToken', eventController_1.getSharedEvent);
// Protected routes
router.post('/', auth_1.protect, eventController_1.createEvent);
router.get('/', auth_1.protect, eventController_1.getEvents);
router.get('/:id', auth_1.protect, eventController_1.getEvent);
router.put('/:id', auth_1.protect, eventController_1.updateEvent);
router.delete('/:id', auth_1.protect, eventController_1.deleteEvent);
exports.default = router;
