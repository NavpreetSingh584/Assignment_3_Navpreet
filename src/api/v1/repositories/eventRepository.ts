import * as firestoreRepo from "./firestoreRepository";
import { Event, CreateEventInput, UpdateEventInput } from "../models/eventModel";

const COLLECTION = "events";

export const createEvent = async (
  data: CreateEventInput
): Promise<Event> => {
  const id = await firestoreRepo.createDocument(COLLECTION, data);
  return { id, ...data } as Event;
};

export const getAllEvents = async (): Promise<Event[]> => {
  const snapshot = await firestoreRepo.getDocuments(COLLECTION);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Event[];
};

export const getEventById = async (
  id: string
): Promise<Event | null> => {
  const doc = await firestoreRepo.getDocumentById(COLLECTION, id);
  if (!doc) return null;

  return {
    id: doc.id,
    ...doc.data(),
  } as Event;
};

export const updateEvent = async (
  id: string,
  data: UpdateEventInput
): Promise<void> => {
  await firestoreRepo.updateDocument(COLLECTION, id, data);
};

export const deleteEvent = async (id: string): Promise<void> => {
  await firestoreRepo.deleteDocument(COLLECTION, id);
};
