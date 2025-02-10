import config from "./config.js"
import express, { RequestHandler, Router } from "express"
import ViteExpress from "vite-express"
import { constants as httpConstants } from "node:http2"
import multer from "multer"

export type ErrorResponse = {
  messages: string[]
}

function errorResponse(details: string | string[]): ErrorResponse {
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

const imageFileToDataURL = (
  file: Express.Multer.File | undefined,
): string | undefined => {
  if (!file) {
    return
  }

  // wont be present if using non memory storage
  if (!file.buffer) {
    return
  }

  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
}

const fileHandler = (fieldName: string): RequestHandler => {
  return (req, res, next) => {
    const mb = 1024 * 1024
    const fileSizeLimit = 2 * mb // could be an env var

    const upload = multer({
      limits: {
        fileSize: fileSizeLimit,
      },
    }).single(fieldName)

    upload(req, res, function (error) {
      console.error(error)

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
        res
          .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send(errorResponse("Unexpected error"))
        return
      }

      next()
    })
  }
}

export type Certificate = {
  subject: string
  studentName: string
  date: string
  signatureName: string
  image: string
}

type PostCertificateRequest = Express.Request & { body: Certificate }

const apiRouter = (): Router => {
  const api = Router()

  api.post(
    "/certificates",
    fileHandler("image"),
    async (req: PostCertificateRequest, res) => {
      const certificateData = req.body
      const validationErrors: string[] = []

      // validations
      if (!req.body.subject) {
        validationErrors.push("Subject is required")
      } else if (req.body.subject.length < 3 || req.body.subject.length > 20) {
        validationErrors.push(
          "Subject requires at least 3, and at most 20 characters",
        )
      }

      if (!req.body.studentName) {
        validationErrors.push("Student Name is required")
      } else if (
        req.body.studentName.length < 3 ||
        req.body.studentName.length > 24
      ) {
        validationErrors.push(
          "Student Name requires at least 3, and at most 24 characters",
        )
      }

      const date = new Date(req.body.date)
      if (!req.body.date) {
        validationErrors.push("Date is required")
      } else if (Number.isNaN(date.valueOf())) {
        validationErrors.push("Date provided is invalid")
      }

      if (!req.body.signatureName) {
        validationErrors.push("Signature Name is required")
      } else if (
        req.body.signatureName.length < 3 ||
        req.body.signatureName.length > 24
      ) {
        validationErrors.push(
          "Signature Name requires at least 3, and at most 46 characters",
        )
      }

      // image validations
      const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"]
      if (!req.file) {
        validationErrors.push("Image file is required")
      } else if (!allowedMimeTypes.includes(req.file.mimetype)) {
        validationErrors.push(
          "Image files are required to be either jpeg or png",
        )
      }

      if (validationErrors.length > 0) {
        res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send(errorResponse(validationErrors))
        return
      }
      const imageDataURL = imageFileToDataURL(req.file)
      if (!imageDataURL) {
        res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send(errorResponse("Unexpected image file error"))
        return
      }
      certificateData.image = imageDataURL

      // generator client - create/reuse JWT
      // generator client - send
      // serve result
      // save certificate data to db

      res.send(certificateData)
    },
  )

  return api
}

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection", err)
  process.exit(1)
})

const app = express()

app.use("/api", apiRouter())

ViteExpress.listen(app, config.CERTIFICATES_PORT, () =>
  console.log(`Server is listening on port ${config.CERTIFICATES_PORT}...`),
)
