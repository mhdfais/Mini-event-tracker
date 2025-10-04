import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Event from '../model/Event';


export const createEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, dateTime, location, description } = req.body;

    if (!title || !dateTime || !location) {
      res.status(400).json({ 
        message: 'Please provide title, date/time, and location' 
      });
      return;
    }

    const event = await Event.create({
      user: req.user?.id,
      title,
      dateTime,
      location,
      description
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await Event.find({ user: req.user?.id }).sort({ dateTime: 1 });
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await Event.findById(req.params.id);

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
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.user.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Not authorized to update this event' });
      return;
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }) as any;

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};


export const deleteEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.user.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Not authorized to delete this event' });
      return;
    }

    await event.deleteOne();

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};


export const getSharedEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await Event.findOne({ shareToken: req.params.shareToken })
      .populate('user', 'email');

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};