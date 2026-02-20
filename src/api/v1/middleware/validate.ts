import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import Joi from "joi";
import { HTTP_STATUS } from "../../../constants/httpStatus";

/**
 * If you already have this type in your project, use it instead.
 * Otherwise you can remove this and type the function return as:
 * (req: Request, res: Response, next: NextFunction) => void
 */
export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export interface RequestSchema {
  body?: ObjectSchema;
  params?: ObjectSchema;
  query?: ObjectSchema;
}

interface ValidationOptions {
  stripBody?: boolean;
  stripQuery?: boolean;
  stripParams?: boolean;
}

/**
 * Creates an Express middleware function that validates req.body, req.params, and req.query
 * against separate Joi schemas and strips unknown fields as configured.
 *
 * @param schemas - Object containing Joi schemas for body, params, and query
 * @param options - Validation options for stripping request payloads
 * @returns Express middleware function that performs validation
 */
export const validateRequest = (
  schemas: RequestSchema,
  options: ValidationOptions = {}
): MiddlewareFunction => {
  const STRIP_BODY = true;
  const STRIP_PARAMS = true;
  const STRIP_QUERY = false;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: string[] = [];

      /**
       * Validate a specific part of the request against a Joi schema
       */
      const validateRequestSection = <T>(
        validationSchema: ObjectSchema,
        requestData: T,
        requestSectionName: string,
        shouldStripFields: boolean
      ): T => {
        const { error, value: strippedFields } = validationSchema.validate(
          requestData,
          {
            abortEarly: false,
            stripUnknown: shouldStripFields,
            convert: true,
          } as Joi.ValidationOptions
        );

        if (error) {
          errors.push(
            ...error.details.map(
              (detail) => `${requestSectionName}: ${detail.message}`
            )
          );
        } else if (shouldStripFields) {
          return strippedFields as T;
        }

        return requestData;
      };

      // Validate each request part if a schema is provided
      if (schemas.body) {
        req.body = validateRequestSection(
          schemas.body,
          req.body,
          "Body",
          options.stripBody ?? STRIP_BODY
        );
      }

      if (schemas.params) {
        req.params = validateRequestSection(
          schemas.params,
          req.params,
          "Params",
          options.stripParams ?? STRIP_PARAMS
        );
      }

      if (schemas.query) {
        req.query = validateRequestSection(
          schemas.query,
          req.query,
          "Query",
          options.stripQuery ?? STRIP_QUERY
        );
      }

      // If there are validation errors, return them
      if (errors.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: `Validation error: ${errors.join(", ")}`,
        });
      }

      next();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(errorMessage);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Error occurred during validation",
      });
    }
  };
};
