import { PDFGeneratorAPIClient } from "./clients/pdfGenerator.js"
import config from "./config.js"
import express from "express"
import ViteExpress from "vite-express"
import { constants as httpConstants } from "node:http2"
import { errorResponse } from "./utils/http.js"
import { ValidationError } from "./utils/validation.js"
import { CertificateRouter as CertificatesRouter } from "./certificate/routes.js"

const apiErrorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof ValidationError) {
    return res
      .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
      .send(errorResponse(err.messages))
  }

  res
    .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send(errorResponse("Unexpected error"))
}

const app = express()

const apiRouter = (): express.Router => {
  const api = express.Router()

  const pdfGeneratorClient = new PDFGeneratorAPIClient(
    config.PDF_GENERATOR_API_KEY,
    config.PDF_GENERATOR_API_SECRET,
    config.PDF_GENERATOR_WORKSPACE_ID,
    config.PDF_GENERATOR_CERTIFICATE_TEMPLATE_ID,
  )

  api.use(CertificatesRouter(pdfGeneratorClient))

  api.use(apiErrorHandler)

  return api
}

app.use("/api", apiRouter())

ViteExpress.listen(app, config.CERTIFICATES_PORT, () =>
  console.log(`Server is listening on port ${config.CERTIFICATES_PORT}...`),
)
