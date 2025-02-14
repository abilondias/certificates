import express, { Router } from "express"
import { fileUploadHandler, ErrorResponse } from "../utils/http.js"
import multer from "multer"
import config from "../config.js"
import { constants as httpConstants } from "node:http2"
import {
  postCertificatesValidation,
  postCertificatesUploadValidation,
} from "./validations.js"
import { Certificate } from "./types.js"
import { CertificatesService } from "./service.js"

export type PostCertificatesRequest = Express.Request & { body: Certificate }

export type PostCertificatesUploadRequest = Express.Request & {
  body: Omit<Certificate, "image">
  file: Express.Multer.File
}

/**
 * Represents the certificates routes
 */
export class CertificatesRoutes {
  private certificatesService: CertificatesService

  /**
   * Creates an instance of CertificatesRoutes
   */
  constructor(certificatesService: CertificatesService) {
    this.certificatesService = certificatesService
  }

  /**
   * POST /certificates
   *
   * Validates certificate data, generates the certificate's PDF document and stores information in the database.
   *
   * Accepts application/json
   *
   * @param {PostCertificatesRequest} req
   * @returns {Response} 201 - Generated Certificate
   * @returns {ErrorResponse} 400 - Malformed Request/Validation Error
   * @returns {ErrorResponse} 429 - Too many requests
   * @returns {ErrorResponse} 500 - Internal Server Error
   *
   */
  handlePostCertificates = async (
    req: PostCertificatesRequest,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const validation = postCertificatesValidation(req)
      if (validation.failed()) {
        throw validation.error()
      }
      const response = await this.certificatesService.generate(req.body)
      if (!response.ok) {
        throw response
      }
      const create = await this.certificatesService.create(req.body)
      if (!create.lastID) {
        throw create
      }
      console.debug("Created user with Id: ", create.lastID)

      res.status(httpConstants.HTTP_STATUS_CREATED).send(await response.json())
    } catch (error) {
      if (
        error instanceof Response &&
        error.status == httpConstants.HTTP_STATUS_TOO_MANY_REQUESTS
      ) {
        const seconds = error.headers.get("Retry-After")
        res
          .status(httpConstants.HTTP_STATUS_TOO_MANY_REQUESTS)
          .header("Retry-After", seconds || "")
          .send(new ErrorResponse(`Too many requests`))
        return
      }

      next(error)
    }
  }

  /**
   * POST /certificates-with-upload
   *
   * Validates certificate data, creates a data URL from the uploaded image file,
   * generates the certificate's PDF document, and stores information in the database.
   *
   * Accepts multipart/form-data
   *
   * @param {PostCertificatesUploadRequest} req
   *
   * @returns {Response} 201 - Generated Certificate
   * @returns {ErrorResponse} 400 - Malformed Request/Validation Error
   * @returns {ErrorResponse} 429 - Too many requests
   * @returns {ErrorResponse} 500 - Internal Server Error
   *
   */
  handlePostCertificatesUpload = async (
    req: PostCertificatesRequest,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const validation = postCertificatesUploadValidation(req)
      if (validation.failed()) {
        throw validation.error()
      }
      if (!req.file || !req.file.buffer) {
        throw new Error("Unexpected image file error")
      }
      const imageDataURL = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`

      req.body.image = imageDataURL
      const response = await this.certificatesService.generate(req.body)
      if (!response.ok) {
        throw response
      }
      const create = await this.certificatesService.create(req.body)
      if (!create.lastID) {
        throw create
      }
      console.debug("Created user with Id: ", create.lastID)

      res.status(httpConstants.HTTP_STATUS_CREATED).send(await response.json())
    } catch (error) {
      if (
        error instanceof Response &&
        error.status == httpConstants.HTTP_STATUS_TOO_MANY_REQUESTS
      ) {
        const seconds = error.headers.get("Retry-After")
        res
          .status(httpConstants.HTTP_STATUS_TOO_MANY_REQUESTS)
          .header("Retry-After", seconds || "")
          .send(new ErrorResponse(`Too many requests`))
        return
      }

      next(error)
    }
  }

  /**
   * Creates the express router for certificates
   */
  router(): express.Router {
    const router = Router()

    router.post("/certificates", express.json(), this.handlePostCertificates)

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
      this.handlePostCertificatesUpload,
    )

    return router
  }
}
