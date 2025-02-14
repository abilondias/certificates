import { RequestHandler } from "express"
import multer from "multer"
import { constants as httpConstants } from "node:http2"
import config from "../config.js"

/**
 * Represents the default error response.
 */
export class ErrorResponse {
  public messages: string[]

  /**
   * Creates the default error response.
   *
   * @param {string | string[]} details - message, or messages to include in the response
   */
  constructor(details: string | string[]) {
    this.messages = typeof details == "string" ? [details] : details
  }
}

/**
 * Creates a file upload handler for a single field.
 *
 * Reads a file from the specified field, and handles file size error
 * if its over the specified limit.
 *
 * @param {string} fieldName - form data field name
 * @return {express.RequestHandler}
 */
export const fileUploadHandler = (
  options: multer.Options,
  fieldName: string,
): RequestHandler => {
  return (req, res, next) => {
    const upload = multer(options).single(fieldName)

    upload(req, res, function (error) {
      if (error instanceof multer.MulterError) {
        switch (error.code) {
          case "LIMIT_FILE_SIZE":
            res
              .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
              .send(new ErrorResponse(`Image file has to be at most ${config.MAX_IMAGE_FILE_SIZE_MB}mb`))
            break
          default:
            res
              .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
              .send(new ErrorResponse("Unexpected file error"))
            break
        }
        return
      } else if (error) {
        return next(error)
      }

      next()
    })
  }
}
