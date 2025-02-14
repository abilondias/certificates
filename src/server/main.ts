import { PDFGeneratorAPIClient } from "./clients/pdfGenerator.js"
import config from "./config.js"
import express from "express"
import ViteExpress from "vite-express"
import { constants as httpConstants } from "node:http2"
import { ErrorResponse } from "./utils/http.js"
import { ValidationError } from "./utils/validation.js"
import { CertificatesRoutes } from "./certificate/routes.js"
import { CertificatesService } from "./certificate/service.js"

/**
 * Error handling middleware for express
 *
 * Handles:
 * - ValidationError: Responds with Bad Request, along with the validation error messages
 * - SyntaxError: Responds with Bad Request
 *
 * Other errors are logged and responded with Internal Server Error
 *
 * @param {any} err
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 *
 * @returns {void}
 */
const apiErrorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof ValidationError) {
    return res
      .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
      .send(new ErrorResponse(err.messages))
  }

  if (err instanceof SyntaxError && "body" in err) {
    return res
      .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
      .send(new ErrorResponse("Invalid payload"))
  }

  console.error("Server error", err)

  return res
    .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send(new ErrorResponse("Unexpected server error"))
}

/**
 * Creates a router for the API
 *
 * @returns {express.Router}
 */
const apiRouter = (): express.Router => {
  const api = express.Router()

  const pdfGeneratorClient = new PDFGeneratorAPIClient(
    config.PDF_GENERATOR_API_KEY,
    config.PDF_GENERATOR_API_SECRET,
    config.PDF_GENERATOR_WORKSPACE_ID,
    config.PDF_GENERATOR_CERTIFICATE_TEMPLATE_ID,
  )

  const certificatesService = new CertificatesService(pdfGeneratorClient)
  const certificatesRoutes = new CertificatesRoutes(certificatesService)
  api.use(certificatesRoutes.router())

  api.use(apiErrorHandler)

  return api
}

const app = express()

app.use("/api", apiRouter())

ViteExpress.listen(app, config.CERTIFICATES_PORT, () =>
  console.log(`Server is listening on port ${config.CERTIFICATES_PORT}...`),
)
