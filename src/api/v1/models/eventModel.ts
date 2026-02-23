/**
 * Represents an event in the system
 */
export interface Event {
  id: string;
  name: string;
  date: string; // stored as ISO string
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
export type CreateEventInput = {
  name: string;
  description: string;
  date: string; // must be string (ISO date)
  capacity: number;
  status?: string;
  category?: string;
};

/**
 * Input type for updating an event
 */
export type UpdateEventInput = Partial<CreateEventInput>;
