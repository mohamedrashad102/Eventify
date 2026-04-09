import { Router } from 'express';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';

const router = Router();

// ======= Get all events (public) =======
router.get('/', getEvents);

// ======= Get single event (public) =======
router.get('/:id', getEvent);

// ======= Create new event (admin only) =======
router.post('/', createEvent);

// ======= Update event (admin only) =======
router.put('/:id', updateEvent);

// ======= Delete event (admin only) =======
router.delete('/:id', deleteEvent);

export default router;