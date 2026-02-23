import {
  QuerySnapshot,
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
 * Retrieve all events
 */
export const getAllEvents = async (): Promise<Event[]> => {
  const snapshot: QuerySnapshot = await getDocuments(COLLECTION);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Event, "id">;

    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
};

/**
 * Create event
 */
export const createEvent = async (
  eventData: CreateEventInput
): Promise<Event> => {
  const now: Date = new Date();

  const newEvent: Omit<Event, "id"> = {
    ...eventData,
    createdAt: now,
    updatedAt: now,
  };

  const eventId: string = await createDocument<Omit<Event, "id">>(
    COLLECTION,
    newEvent
  );

  return {
    id: eventId,
    ...newEvent,
  };
};

/**
 * Get event by ID
 */
export const getEventById = async (id: string): Promise<Event> => {
  const doc: DocumentSnapshot | null = await getDocumentById(
    COLLECTION,
    id
  );

  if (!doc || !doc.exists) {
    const error: any = new Error(`Event with ID ${id} not found`);
    error.status = 404;
    throw error;
  }

  const data = doc.data() as Omit<Event, "id">;

  return {
    id: doc.id,
    ...data,
  };
};

/**
 * Update event
 */
export const updateEvent = async (
  id: string,
  eventData: UpdateEventInput
): Promise<Event> => {
  const existingEvent = await getEventById(id);

  const updatedEvent: Event = {
    ...existingEvent,
    ...eventData,
    updatedAt: new Date(),
  };

  // Remove undefined values before sending to Firestore
  const cleanedData = Object.fromEntries(
    Object.entries(updatedEvent).filter(([_, value]) => value !== undefined)
  ) as Event;

  await updateDocument<Event>(COLLECTION, id, cleanedData);

  return cleanedData;
};

/**
 * Delete event
 */
export const deleteEvent = async (id: string): Promise<void> => {
  await getEventById(id);
  await deleteDocument(COLLECTION, id);
};
