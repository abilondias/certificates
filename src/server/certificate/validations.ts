import { ValidationResult } from "../utils/validation.js"
import { PostCertificatesRequest } from "./routes.js"

/**
 * Validates POST /certificates
 */
export const postCertificatesValidation = (
  req: PostCertificatesRequest,
): ValidationResult => {
  const result = basePostCertificatesValidation(req)

  if (!req.body.image) {
    result.messages.push("Image URL is required")
  } else if (!isValidImageURL(req.body.image)) {
    result.messages.push("Image URL must be a valid image URL")
  }

  return result
}

/**
 * Checks if the provided image URL has an allowed extension
 */
export const isValidImageURL = (imageURL: string): boolean => {
  try {
    const parsedURL = new URL(imageURL)
    const allowedExtensions = /\.(jpeg|jpg|png)$/i
    return allowedExtensions.test(parsedURL.pathname)
  } catch (error) {
    return false
  }
}

/**
 * Validates POST /certificates-with-validation
 */
export const postCertificatesUploadValidation = (
  req: PostCertificatesRequest,
): ValidationResult => {
  const result = basePostCertificatesValidation(req)

  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"]
  if (!req.file) {
    result.messages.push("Image file is required")
  } else if (!allowedMimeTypes.includes(req.file.mimetype)) {
    result.messages.push("Image files are required to be either jpeg or png")
  }

  return result
}

/**
 * Base validation for PostCertificatesRequest
 */
export const basePostCertificatesValidation = (
  req: PostCertificatesRequest,
): ValidationResult => {
  const result = new ValidationResult()

  if (!req.body.subject) {
    result.messages.push("Subject is required")
  } else if (req.body.subject.length < 3 || req.body.subject.length > 20) {
    result.messages.push(
      "Subject requires at least 3, and at most 20 characters",
    )
  }

  if (!req.body.studentName) {
    result.messages.push("Student Name is required")
  } else if (
    req.body.studentName.length < 3 ||
    req.body.studentName.length > 24
  ) {
    result.messages.push(
      "Student Name requires at least 3, and at most 24 characters",
    )
  }

  const date = new Date(req.body.date)
  if (!req.body.date) {
    result.messages.push("Date is required")
  } else if (Number.isNaN(date.valueOf())) {
    result.messages.push("Date provided is invalid")
  }

  if (!req.body.signatureName) {
    result.messages.push("Signature Name is required")
  } else if (
    req.body.signatureName.length < 3 ||
    req.body.signatureName.length > 24
  ) {
    result.messages.push(
      "Signature Name requires at least 3, and at most 46 characters",
    )
  }

  return result
}
