import dotenv from "dotenv"
import envalid from "envalid"

/**
 * Represents an object for all environment variables
 */
export type Config = {
  CERTIFICATES_PORT: number
  MAX_IMAGE_FILE_SIZE_MB: number
  SQLITE_DATABASE_FILENAME: string
  PDF_GENERATOR_WORKSPACE_ID: string
  PDF_GENERATOR_API_KEY: string
  PDF_GENERATOR_API_SECRET: string
  PDF_GENERATOR_CERTIFICATE_TEMPLATE_ID: string
}

/**
 * Loads environment variables and creates a Config object.
 *
 * Parses from .env.local for non-production environments,
 * otherwise reads directly from process.env.
 *
 */
export const loadConfig = (): Config => {
  if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: ".env.local" })
  }

  const env = envalid.cleanEnv(process.env, {
    CERTIFICATES_PORT: envalid.num(),
    MAX_IMAGE_FILE_SIZE_MB: envalid.num(),
    PDF_GENERATOR_WORKSPACE_ID: envalid.str(),
    PDF_GENERATOR_API_KEY: envalid.str(),
    PDF_GENERATOR_API_SECRET: envalid.str(),
    PDF_GENERATOR_CERTIFICATE_TEMPLATE_ID: envalid.str(),
  })

  return {
    CERTIFICATES_PORT: env.CERTIFICATES_PORT,
    MAX_IMAGE_FILE_SIZE_MB: env.MAX_IMAGE_FILE_SIZE_MB,
    SQLITE_DATABASE_FILENAME: "internal.db",

    PDF_GENERATOR_WORKSPACE_ID: env.PDF_GENERATOR_WORKSPACE_ID,
    PDF_GENERATOR_API_KEY: env.PDF_GENERATOR_API_KEY,
    PDF_GENERATOR_API_SECRET: env.PDF_GENERATOR_API_SECRET,
    PDF_GENERATOR_CERTIFICATE_TEMPLATE_ID: env.PDF_GENERATOR_CERTIFICATE_TEMPLATE_ID,
  }
}

const config = loadConfig()

export default config
