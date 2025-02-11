import express, { Router } from "express"
import { errorResponse, fileUploadHandler } from "../utils/http.js"
import multer from "multer"
import config from "../config.js"
import { ValidationError } from "../utils/validation.js"
import { constants as httpConstants } from "node:http2"
import {
  postCertificatesValidation,
  postCertificatesWithUploadValidation,
} from "./validations.js"
import {
  PDFBase64Response,
  PDFGeneratorAPIClient,
} from "../clients/pdfGenerator.js"

export type Certificate = {
  subject: string
  studentName: string
  date: string
  signatureName: string
  image: string
}

export type PostCertificatesRequest = Express.Request & { body: Certificate }

export const CertificateRouter = (
  pdfGeneratorClient: PDFGeneratorAPIClient,
) => {
  const router = Router()

  router.post(
    "/certificates",
    express.json(),
    async (req: PostCertificatesRequest, res, next) => {
      try {
        const validation = postCertificatesValidation(req)
        if (validation.failed()) {
          throw new ValidationError(validation.messages)
        }

        const certificateTemplateId = "1326975"
        const generateCertificate =
          await pdfGeneratorClient.generateCertificateDocument({
            template: {
              id: certificateTemplateId,
              data: {
                date: req.body.date,
                subject: req.body.subject,
                signature_name: req.body.signatureName,
                student_name: req.body.studentName,
                image: req.body.image,
              },
            },
            format: "pdf",
            output: "base64",
            name: `certificate-${req.body.subject}-${req.body.date}`,
            testing: false,
          })

        if (!generateCertificate.ok) {
          throw generateCertificate
        }

        const response: PDFBase64Response = await generateCertificate.json()
        // save certificate data to db

        res.status(httpConstants.HTTP_STATUS_CREATED).send(response)
      } catch (error) {
        console.error("Failed to generate document", error)

        if (
          error instanceof Response &&
          error.status == httpConstants.HTTP_STATUS_TOO_MANY_REQUESTS
        ) {
          const seconds = error.headers.get("Retry-After")
          res
            .status(httpConstants.HTTP_STATUS_TOO_MANY_REQUESTS)
            .header("Retry-After", seconds || "")
            .send(errorResponse(`Too many requests`))
          return
        }

        next(error)
      }
    },
  )

  const mb = 1024 * 1024
  const fileUpload = fileUploadHandler(
    {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: config.MAX_IMAGE_FILE_SIZE_MB * mb,
      },
    },
    "image",
  )
  router.post(
    "/certificates-with-upload",
    fileUpload,
    async (req: PostCertificatesRequest, res, next) => {
      try {
        const validation = postCertificatesWithUploadValidation(req)
        if (validation.failed()) {
          throw new ValidationError(validation.messages)
        }
        if (!req.file || !req.file.buffer) {
          throw new Error("Unexpected image file error")
        }

        const imageDataURL = `data:${
          req.file.mimetype
        };base64,${req.file.buffer.toString("base64")}`

        const certificateTemplateId = "1326975"
        const generateCertificate =
          await pdfGeneratorClient.generateCertificateDocument({
            template: {
              id: certificateTemplateId,
              data: {
                date: req.body.date,
                subject: req.body.subject,
                signature_name: req.body.signatureName,
                student_name: req.body.studentName,
                image: imageDataURL,
              },
            },
            format: "pdf",
            output: "base64",
            name: `certificate-${req.body.subject}-${req.body.date}`,
            testing: false,
          })

        if (!generateCertificate.ok) {
          throw generateCertificate
        }

        const response: PDFBase64Response = await generateCertificate.json()

        // save certificate data to db

        res.status(httpConstants.HTTP_STATUS_CREATED).send(response)
      } catch (error) {
        console.error("Failed to generate document", error)

        if (
          error instanceof Response &&
          error.status == httpConstants.HTTP_STATUS_TOO_MANY_REQUESTS
        ) {
          const seconds = error.headers.get("Retry-After")
          res
            .status(httpConstants.HTTP_STATUS_TOO_MANY_REQUESTS)
            .header("Retry-After", seconds || "")
            .send(errorResponse(`Too many requests`))
          return
        }

        next(error)
      }
    },
  )

  return router
}
