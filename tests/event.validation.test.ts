import request from "supertest";
import app from "../src/app";

describe("POST /api/v1/events - Validation", () => {
  it("should return 400 if required field is missing", async () => {
    const body = {
      date: new Date().toISOString(),
      capacity: 10,
      category: "meetup",
    };

    const response = await request(app).post("/api/v1/events").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 for invalid date format", async () => {
    const body = {
      name: "Tech Event",
      date: "invalid-date",
      capacity: 10,
      category: "meetup",
    };

    const response = await request(app).post("/api/v1/events").send(body);

    expect(response.status).toBe(400);
  });

  it("should return 400 for capacity below minimum", async () => {
    const body = {
      name: "Tech Event",
      date: new Date().toISOString(),
      capacity: 0,
      category: "meetup",
    };

    const response = await request(app).post("/api/v1/events").send(body);

    expect(response.status).toBe(400);
  });
});
