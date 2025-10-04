"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedEvent = exports.deleteEvent = exports.updateEvent = exports.getEvent = exports.getEvents = exports.createEvent = void 0;
const Event_1 = __importDefault(require("../model/Event"));
// interface CreateEventBody {
//   title: string;
//   dateTime: Date;
//   location: string;
//   description?: string;
// }
// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res, next) => {
    try {
        const { title, dateTime, location, description } = req.body;
        // Validation
        if (!title || !dateTime || !location) {
            res.status(400).json({
                message: 'Please provide title, date/time, and location'
            });
            return;
        }
        // Create event
        const event = await Event_1.default.create({
            user: req.user?.id,
            title,
            dateTime,
            location,
            description
        });
        res.status(201).json(event);
    }
    catch (error) {
        next(error);
    }
};
exports.createEvent = createEvent;
// @desc    Get user's events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res, next) => {
    try {
        const events = await Event_1.default.find({ user: req.user?.id }).sort({ dateTime: 1 });
        res.status(200).json(events);
    }
    catch (error) {
        next(error);
    }
};
exports.getEvents = getEvents;
// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
const getEvent = async (req, res, next) => {
    try {
        const event = await Event_1.default.findById(req.params.id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        // Check ownership
        if (event.user.toString() !== req.user?.id) {
            res.status(403).json({ message: 'Not authorized to view this event' });
            return;
        }
        res.status(200).json(event);
    }
    catch (error) {
        next(error);
    }
};
exports.getEvent = getEvent;
// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res, next) => {
    try {
        let event = await Event_1.default.findById(req.params.id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        // Check ownership
        if (event.user.toString() !== req.user?.id) {
            res.status(403).json({ message: 'Not authorized to update this event' });
            return;
        }
        event = await Event_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json(event);
    }
    catch (error) {
        next(error);
    }
};
exports.updateEvent = updateEvent;
// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event_1.default.findById(req.params.id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        // Check ownership
        if (event.user.toString() !== req.user?.id) {
            res.status(403).json({ message: 'Not authorized to delete this event' });
            return;
        }
        await event.deleteOne();
        res.status(200).json({ message: 'Event deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteEvent = deleteEvent;
// @desc    Get shared event (public)
// @route   GET /api/events/share/:shareToken
// @access  Public
const getSharedEvent = async (req, res, next) => {
    try {
        const event = await Event_1.default.findOne({ shareToken: req.params.shareToken })
            .populate('user', 'email');
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.status(200).json(event);
    }
    catch (error) {
        next(error);
    }
};
exports.getSharedEvent = getSharedEvent;
