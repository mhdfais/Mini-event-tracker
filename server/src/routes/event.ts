import express from 'express';
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getSharedEvent
} from '../controller/eventController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/share/:shareToken', getSharedEvent);

router.post('/', protect, createEvent);
router.get('/', protect, getEvents);
router.get('/:id', protect, getEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

export default router;