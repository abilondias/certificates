import { createContext, useContext } from "react";

type CertificateFields = {
  subject: string
  studentName: string
  date: string
  signatureName: string
  image: string
}

export type APIError = {
  messages: string[]
}

type CertificateDocumentResponse = {
  response: string,
  meta: {
    name: string
  }
}

export class APIClient {
  async postCertificates(data: CertificateFields) {
    try {
      const response = await fetch("/api/certificates", {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json"
        }
      })
      if (!response.ok) {
        const apiError = await response.json() as APIError
        throw apiError
      }

      const jsonResponse: CertificateDocumentResponse = await response.json()
      return jsonResponse
    } catch (error) {
      throw error as APIError
    }
  }

  async postCertificatesWithUpload(data: Omit<CertificateFields, "image">, image: Blob) {
    try {
      const body = new FormData()
      body.append("subject", data.subject)
      body.append("studentName", data.studentName)
      body.append("date", data.date)
      body.append("signatureName", data.signatureName)
      body.append("image", image)

      const response = await fetch("/api/certificates-with-upload", {
        method: "post",
        body: body,
      })

      if (!response.ok) {
        const apiError = await response.json() as APIError
        throw apiError
      }

      const jsonResponse: CertificateDocumentResponse = await response.json()
      return jsonResponse
    } catch (error) {
      throw error as APIError
    }
  }
}

const APIClientContext = createContext<APIClient | undefined>(undefined)

export const APIContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = new APIClient()

  return (
    <APIClientContext.Provider value={client}>{children}</APIClientContext.Provider>
  )
}

export const useAPIClient = (): APIClient => {
  const client = useContext(APIClientContext)
  if (!client) {
    throw new Error("useAPIClient needs to be used within APIContextProvider")
  }
  return client
}




