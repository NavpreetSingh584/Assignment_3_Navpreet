import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import * as eventService from "../services/eventService";
import { Event } from "../models/eventModel";

/**
 * Retrieve all events
 */
export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events: Event[] = await eventService.getAllEvents();
    res.status(HTTP_STATUS.OK).json(events);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Create a new event
 */
export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, date, capacity, status, category } = req.body;

    const newEvent: Event = await eventService.createEvent({
      name,
      description,
      date,
      capacity,
      status,
      category,
    });

    res.status(HTTP_STATUS.CREATED).json(newEvent);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Get event by ID
 */
export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id: string = req.params.id as string;
    const event: Event = await eventService.getEventById(id);

    res.status(HTTP_STATUS.OK).json(event);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Update event
 */
export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id: string = req.params.id as string;
    const { name, description, date, capacity, status, category } = req.body;

    const updatedEvent: Event = await eventService.updateEvent(id, {
      name,
      description,
      date,
      capacity,
      status,
      category,
    });

    res.status(HTTP_STATUS.OK).json(updatedEvent);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Delete event
 */
export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id: string = req.params.id as string;

    await eventService.deleteEvent(id);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error: unknown) {
    next(error);
  }
};
