import dotenv from "dotenv"
import envalid from "envalid"

type Config = {
  CERTIFICATES_PORT: number
  PDF_GENERATOR_WORKSPACE_ID: string
  PDF_GENERATOR_API_KEY: string
  PDF_GENERATOR_API_SECRET: string
}

const loadConfig = (): Config => {
  if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: ".env.local" })
  }

  const env = envalid.cleanEnv(process.env, {
    CERTIFICATES_PORT: envalid.num(),

    PDF_GENERATOR_WORKSPACE_ID: envalid.str(),
    PDF_GENERATOR_API_KEY: envalid.str(),
    PDF_GENERATOR_API_SECRET: envalid.str(),
  })

  return {
    CERTIFICATES_PORT: env.CERTIFICATES_PORT,

    PDF_GENERATOR_WORKSPACE_ID: env.PDF_GENERATOR_WORKSPACE_ID,
    PDF_GENERATOR_API_KEY: env.PDF_GENERATOR_API_KEY,
    PDF_GENERATOR_API_SECRET: env.PDF_GENERATOR_API_SECRET,
  }
}

const config = loadConfig()

export default config
