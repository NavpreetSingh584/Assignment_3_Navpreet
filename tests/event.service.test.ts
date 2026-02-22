import * as firestoreRepo from "../src/api/v1/repositories/firestoreRepository";
import * as service from "../src/api/v1/services/eventService";

jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Event Service", () => {

  const baseEvent = {
    name: "Test Event",
    description: "Test Description",
    date: new Date().toISOString(),
    capacity: 10,
    category: "meetup",
    status: "active",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --------------------------
  // CREATE
  // --------------------------
  it("should create event", async () => {

    (firestoreRepo.createDocument as jest.Mock)
      .mockResolvedValue("123");

    const result = await service.createEvent(baseEvent);

    expect(firestoreRepo.createDocument)
      .toHaveBeenCalled();

    expect(result.id).toBe("123");
  });

  // --------------------------
  // GET ALL
  // --------------------------
  it("should get all events", async () => {

    const mockSnapshot = {
      docs: [
        {
          id: "1",
          data: () => ({
            ...baseEvent,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        },
      ],
    };

    (firestoreRepo.getDocuments as jest.Mock)
      .mockResolvedValue(mockSnapshot);

    const result = await service.getAllEvents();

    expect(result.length).toBe(1);
    expect(result[0].id).toBe("1");
  });

  // --------------------------
  // GET BY ID
  // --------------------------
  it("should get event by id", async () => {

    const mockDoc = {
      id: "1",
      data: () => ({
        ...baseEvent,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    };

    (firestoreRepo.getDocumentById as jest.Mock)
      .mockResolvedValue(mockDoc);

    const result = await service.getEventById("1");

    expect(result.id).toBe("1");
  });

  // --------------------------
  // UPDATE
  // --------------------------
  it("should update event", async () => {

    const mockDoc = {
      id: "1",
      data: () => ({
        ...baseEvent,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    };

    (firestoreRepo.getDocumentById as jest.Mock)
      .mockResolvedValue(mockDoc);

    (firestoreRepo.updateDocument as jest.Mock)
      .mockResolvedValue(undefined);

    const result = await service.updateEvent("1", { name: "Updated" });

    expect(result.name).toBe("Updated");
  });

  // --------------------------
  // DELETE
  // --------------------------
  it("should delete event", async () => {

    const mockDoc = {
      id: "1",
      data: () => ({
        ...baseEvent,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    };

    (firestoreRepo.getDocumentById as jest.Mock)
      .mockResolvedValue(mockDoc);

    (firestoreRepo.deleteDocument as jest.Mock)
      .mockResolvedValue(undefined);

    await service.deleteEvent("1");

    expect(firestoreRepo.deleteDocument)
      .toHaveBeenCalledWith("events", "1");
  });

});
