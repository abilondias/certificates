import dotenv from "dotenv"
import envalid from "envalid"

type Config = {
  CERTIFICATES_PORT: number
}

const loadConfig = (): Config => {
  if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: ".env.local" })
  }

  const env = envalid.cleanEnv(process.env, {
    CERTIFICATES_PORT: envalid.num(),
  })

  return {
    CERTIFICATES_PORT: env.CERTIFICATES_PORT,
  }
}

const config = loadConfig()

export default config
