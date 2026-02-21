/**
 * Represents an event in the system
 */
export interface Event {
  id: string;
  name: string;
  date: string; // ISO string
  description: string;
  capacity: number;
  status?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input type for creating a new event
 */
export type CreateEventInput = Omit<Event, "id" | "createdAt" | "updatedAt">;

/**
 * Input type for updating an event
 */
export type UpdateEventInput = Partial<CreateEventInput>;
