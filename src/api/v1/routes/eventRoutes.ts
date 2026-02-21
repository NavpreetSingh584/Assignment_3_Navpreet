import { Router } from "express";
import { validateRequest} from "../middleware/validate";
import { eventSchemas } from "../validations/eventValidations";
import * as eventController from "../controllers/eventController";

const router = Router();

// POST /api/v1/events
router.post("/", validateRequest(eventSchemas.create), eventController.createEvent);

// GET /api/v1/events
router.get("/", eventController.getAllEvents);

// GET /api/v1/events/:id
router.get("/:id", eventController.getEventById);

// PUT /api/v1/events/:id
router.put("/:id", validateRequest(eventSchemas.update), eventController.updateEvent);

// DELETE /api/v1/events/:id
router.delete("/:id", eventController.deleteEvent);

export default router;
