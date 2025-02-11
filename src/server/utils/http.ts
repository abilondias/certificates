import { RequestHandler } from "express"
import multer from "multer"
import { constants as httpConstants } from "node:http2"

export type ErrorResponse = {
  messages: string[]
}

export const errorResponse = (details: string | string[]): ErrorResponse => {
  const response: ErrorResponse = {
    messages: [],
  }

  if (typeof details == "string") {
    response.messages.push(details)
    return response
  }
  response.messages = details

  return response
}

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
              .send(errorResponse("Image file has to be at most 2mb"))
            break
          default:
            res
              .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
              .send(errorResponse("Unexpected file error"))
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
