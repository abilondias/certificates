import { RunResult } from "sqlite3"
import { PDFGeneratorAPIClient } from "./../clients/pdfGenerator.js"
import { SQLiteClient } from "./../clients/sqlite.js"
import { Certificate } from "./types.js"

/**
 * Represents a service for certificates, to interact with the database and the PDF Generator API.
 */
export class CertificatesService {
  private sqliteClient: SQLiteClient
  private pdfGeneratorClient: PDFGeneratorAPIClient

  /**
   * Creates an instance of CertificateService.
   */
  constructor(
    sqliteClient: SQLiteClient,
    pdfGeneratorClient: PDFGeneratorAPIClient,
  ) {
    this.sqliteClient = sqliteClient
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

  private CreateCertificateQuery: string =
    "INSERT INTO certificates (date, subject, signature_name, student_name, image) VALUES (?,?,?,?,?)"

  /**
   * Creates a new certificate in the database
   */
  create(data: Certificate): Promise<RunResult> {
    const params = [
      data.date,
      data.subject,
      data.signatureName,
      data.studentName,
      data.image,
    ]
    return this.sqliteClient.run(this.CreateCertificateQuery, params)
  }
}
