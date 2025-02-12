import { SignJWT } from "jose"

type DocumentOptions = {
  template: {
    id?: string
    data: {
      date: string
      subject: string
      signature_name: string
      student_name: string
      image: string
    }
  }
  format: "pdf" | "html" | "zip" | "xlsx"
  output: "base64" | "url" | "file"
  name: string
  testing: boolean
}

export type PDFBase64Response = {
  response: string
  meta: {
    name: string
    display_name: string
    encoding: string
    "content-type": string
  }
}

export class PDFGeneratorAPIClient {
  private apiKey: string
  private apiSecret: Uint8Array
  private workspaceIdentifier: string

  private certificateTemplateId: string

  private baseURL = "https://us1.pdfgeneratorapi.com/api/v4"

  constructor(
    apiKey: string,
    apiSecret: string,
    workspaceIdentifier: string,
    certificateTemplateId: string,
  ) {
    this.apiKey = apiKey
    this.apiSecret = new TextEncoder().encode(apiSecret)
    this.workspaceIdentifier = workspaceIdentifier

    this.certificateTemplateId = certificateTemplateId
  }

  async generateCertificateDocument(options: DocumentOptions) {
    const token = await this.generateJWT()

    if (!options.template.id || options.template.id === "") {
      options.template.id = this.certificateTemplateId
    }

    return fetch(`${this.baseURL}/documents/generate`, {
      method: "post",
      body: JSON.stringify(options),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
  }

  private generateJWT(): Promise<string> {
    const JWTPayload = {
      iss: this.apiKey,
      sub: this.workspaceIdentifier,
    }
    return new SignJWT(JWTPayload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime("10s")
      .sign(this.apiSecret)
  }
}
