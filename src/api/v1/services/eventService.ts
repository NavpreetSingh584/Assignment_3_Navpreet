import {
  QuerySnapshot,
  DocumentData,
  DocumentSnapshot,
} from "firebase-admin/firestore";

import { Event, CreateEventInput, UpdateEventInput } from "../models/eventModel";

import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "../repositories/firestoreRepository";

const COLLECTION: string = "events";

/**
 * Retrieves all events
 */
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const snapshot: QuerySnapshot = await getDocuments(COLLECTION);

    const events: Event[] = snapshot.docs.map((doc) => {
      const data: DocumentData = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Event;
    });

    return events;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Creates a new event
 */
export const createEvent = async (
  eventData: CreateEventInput
): Promise<Event> => {
  const now: Date = new Date();

  const newEvent: Partial<Event> = {
    ...eventData,
    createdAt: now,
    updatedAt: now,
  };

  const eventId: string = await createDocument<Event>(
    COLLECTION,
    newEvent
  );

  return structuredClone({ id: eventId, ...newEvent } as Event);
};

/**
 * Retrieves a single event by ID
 */
export const getEventById = async (id: string): Promise<Event> => {
  const doc: DocumentSnapshot | null = await getDocumentById(
    COLLECTION,
    id
  );

  if (!doc) {
    throw new Error(`Event with ID ${id} not found`);
  }

  const data: DocumentData | undefined = doc.data();

  const event: Event = {
    id: doc.id,
    ...data,
    createdAt: data?.createdAt.toDate(),
    updatedAt: data?.updatedAt.toDate(),
  } as Event;

  return structuredClone(event);
};

/**
 * Updates an existing event
 */
export const updateEvent = async (
  id: string,
  eventData: UpdateEventInput
): Promise<Event> => {
  const existingEvent: Event = await getEventById(id);

  const updatedEvent: Event = {
    ...existingEvent,
    updatedAt: new Date(),
  };

  // Manual partial update (demo-style requirement)
  if (eventData.name !== undefined)
    updatedEvent.name = eventData.name;

  if (eventData.date !== undefined)
    updatedEvent.date = eventData.date;

  if (eventData.capacity !== undefined)
    updatedEvent.capacity = eventData.capacity;

  if (eventData.status !== undefined)
    updatedEvent.status = eventData.status;

  if (eventData.category !== undefined)
    updatedEvent.category = eventData.category;

  await updateDocument<Event>(COLLECTION, id, updatedEvent);

  return structuredClone(updatedEvent);
};

/**
 * Deletes an event
 */
export const deleteEvent = async (id: string): Promise<void> => {
  const existingEvent: Event = await getEventById(id);

  if (!existingEvent) {
    throw new Error(`Event with ID ${id} not found`);
  }

  await deleteDocument(COLLECTION, id);
};
