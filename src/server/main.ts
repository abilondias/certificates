import express, { Router } from "express"
import ViteExpress from "vite-express"
import { constants as httpConstants } from "node:http2"

const app = express()

const apiRouter = (): Router => {
  const api = Router()
  api.use(express.json())

  api.post("/echo", (req, res) => {
    res.status(httpConstants.HTTP_STATUS_OK).send(req.body)
  })

  return api
}

app.use("/api", apiRouter())

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
)
