import Joi from "joi";
import { RequestSchema } from "../middleware/validate";

/**
 * Event schema organized by request type
 */
export const eventSchemas: Record<string, RequestSchema> = {

  // ============================
  // CREATE EVENT
  // ============================
  create: {
    body: Joi.object({

      name: Joi.string().min(3).max(50).required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name must be at most 50 characters",
      }),

      description: Joi.string().min(3).max(200).required().messages({
        "any.required": "Description is required",
        "string.empty": "Description cannot be empty",
        "string.min": "Description must be at least 3 characters",
        "string.max": "Description must be at most 200 characters",
      }),

      date: Joi.string().isoDate().required().messages({
        "any.required": "Date is required",
        "string.empty": "Date cannot be empty",
        "string.isoDate": "Date must be a valid ISO date",
      }),

      capacity: Joi.number().integer().min(6).max(1000).required().messages({
        "any.required": "Capacity is required",
        "number.base": "Capacity must be a number",
        "number.integer": "Capacity must be an integer",
        "number.min": "Capacity must be at least {#limit}",
        "number.max": "Capacity must be at most 1000",
      }),

      status: Joi.string()
        .valid("draft", "published", "cancelled")
        .default("draft")
        .messages({
          "any.only": "Status must be one of: draft, published, cancelled",
        }),

      category: Joi.string()
        .valid("conference", "workshop", "meetup")
        .required()
        .messages({
          "any.required": "Category is required",
          "string.empty": "Category cannot be empty",
          "any.only": "Category must be one of: conference, workshop, meetup",
        }),

    }),
  },

  // ============================
  // UPDATE EVENT
  // ============================
  update: {
    params: Joi.object({
      id: Joi.string().required().messages({
        "any.required": "Event ID is required",
        "string.empty": "Event ID cannot be empty",
      }),
    }),

    body: Joi.object({

      name: Joi.string().min(3).max(50).optional().messages({
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name must be at most 50 characters",
      }),

      description: Joi.string().min(3).max(200).optional().messages({
        "string.empty": "Description cannot be empty",
        "string.min": "Description must be at least 3 characters",
        "string.max": "Description must be at most 200 characters",
      }),

      date: Joi.string().isoDate().optional().messages({
        "string.empty": "Date cannot be empty",
        "string.isoDate": "Date must be a valid ISO date",
      }),

      capacity: Joi.number().integer().min(6).max(1000).optional().messages({
        "number.base": "Capacity must be a number",
        "number.integer": "Capacity must be an integer",
        "number.min": "Capacity must be at least {#limit}",
        "number.max": "Capacity must be at most 1000",
      }),

      status: Joi.string()
        .valid("draft", "published", "cancelled")
        .optional()
        .messages({
          "any.only": "Status must be one of: draft, published, cancelled",
        }),

      category: Joi.string()
        .valid("conference", "workshop", "meetup")
        .optional()
        .messages({
          "any.only": "Category must be one of: conference, workshop, meetup",
        }),

    })
    .min(1)
    .messages({
      "object.min": "At least one field must be provided for update",
    }),
  },
};
