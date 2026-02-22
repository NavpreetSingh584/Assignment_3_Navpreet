import request from "supertest";
import app from "../src/app";
import * as eventService from "../src/api/v1/services/eventService";

jest.mock("../src/api/v1/middleware/validate", () => ({
  validateRequest: () => (_req: any, _res: any, next: any) => next(),
}));

jest.mock("../src/api/v1/services/eventService");

describe("Event Controller (Required Tests)", () => {

  const validBody = {
    name: "Test Event",
    description: "Test Description",
    date: new Date().toISOString(),
    capacity: 10,
    category: "meetup",
    status: "active",
  };

  const mockEvent = {
    id: "1",
    ...validBody,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET ALL
  it("should return all events (200)", async () => {

    (eventService.getAllEvents as jest.Mock)
      .mockResolvedValue([mockEvent]);

    const response = await request(app)
      .get("/api/v1/events");

    expect(response.status).toBe(200);
  });

  // GET BY ID SUCCESS
  it("should return event by id (200)", async () => {

    (eventService.getEventById as jest.Mock)
      .mockResolvedValue(mockEvent);

    const response = await request(app)
      .get("/api/v1/events/1");

    expect(response.status).toBe(200);
  });

  // GET BY ID NOT FOUND
  it("should return 404 if event not found", async () => {

    (eventService.getEventById as jest.Mock)
      .mockRejectedValue({ status: 404 });

    const response = await request(app)
      .get("/api/v1/events/1");

    expect(response.status).toBe(404);
  });

  // CREATE
  it("should create event (201)", async () => {

    (eventService.createEvent as jest.Mock)
      .mockResolvedValue(mockEvent);

    const response = await request(app)
      .post("/api/v1/events")
      .send(validBody);

    expect(response.status).toBe(201);
  });

  // DELETE
  it("should delete event (204)", async () => {

    (eventService.deleteEvent as jest.Mock)
      .mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/api/v1/events/1");

    expect(response.status).toBe(204);
  });

});
