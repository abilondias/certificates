import { PDFGeneratorAPIClient } from "./../clients/pdfGenerator.js"
import { Certificate } from "./types.js"

/**
 * Represents a service for certificates, to interact with the database and the PDF Generator API.
 */
export class CertificatesService {
  private pdfGeneratorClient: PDFGeneratorAPIClient

  /**
   * Creates an instance of CertificateService.
   */
  constructor(pdfGeneratorClient: PDFGeneratorAPIClient) {
    this.pdfGeneratorClient = pdfGeneratorClient
  }

  /**
   * Calls the PDF Generator API to generate a PDF certificate
   * based on the provided data.
   */
  generate(data: Certificate): Promise<Response> {
    return this.pdfGeneratorClient.generateCertificateDocument({
      template: {
        data: {
          date: data.date,
          subject: data.subject,
          signature_name: data.signatureName,
          student_name: data.studentName,
          image: data.image,
        },
      },
      format: "pdf",
      output: "base64",
      name: `certificate-${data.subject}-${data.date}`,
      testing: false,
    })
  }
}
