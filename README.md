# Certificates

Create certificates in PDF with the [PDF Generator API](https://pdfgeneratorapi.com/).

<details>
  <summary>Preview</summary>
  
  ![pdf-gen-preview](https://github.com/user-attachments/assets/c2508027-9dfd-4b5c-9ea4-33fdde8e9f55)
</details>

## Docs

- [OpenAPI Schema](./docs/openapi.yaml) (open in [Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/abilondias/certificates/refs/heads/main/docs/openapi.yaml))
- [Local Server docs](#other-commands)

## Running the application

### Environment Variables

For running locally, make a copy of `.env.local.example` to `.env.local`

```sh
cp .env.local.example .env.local
```

Assign the following variables:

- **CERTIFICATES_PORT**: Port for the server to listen on
- **MAX_IMAGE_FILE_SIZE_MB**: Maximum size of uploaded files for memory storage in MB
- **PDF_GENERATOR_WORKSPACE_ID**: PDF Generator API - workspace identifier
- **PDF_GENERATOR_API_KEY**: PDF Generator API - API Key
- **PDF_GENERATOR_API_SECRET**: PDF Generator API - API Secret
- **PDF_GENERATOR_CERTIFICATE_TEMPLATE_ID**: ID of the template to use as the certificate template
  - provided template must support the fields
    - **date**: string (YYYY-MM-DD)
    - **subject**: string
    - **signature_name**: string
    - **student_name**: string
    - **image**: string (an image URL)

### Versions

- **node**: >= v22.10.0
- **npm**: >= v11.0.0
- **Docker Engine**: >= 26.1.5

### Running locally

Clone the repository

```sh
git clone https://github.com/abilondias/certificates.git
cd certificates
```

Install dependencies

```sh
npm i
```

Create the database

```sh
npm run db:create
```

Start development server

```sh
npm run dev
```

Access at: http://localhost:3000

### Running with Docker

Before running the start up command, assign the [environment variables](#environment-variables) in `.env.local`

Start up with docker-compose

```sh
docker-compose --file docker-compose.dev.yaml up --watch --build
```

Flags:

- --watch: for development, to synchronize file updates using the watch config in [docker-compose.dev.yaml](./docker-compose.dev.yaml)
- --build: ensure images are built

Access at: http://localhost:3000

## Running local Playwright tests

Requires the server to be running at `localhost:3000` with either the local setup, or Docker.

To run using a production build of the front-end code with Docker compose

```sh
docker-compose --file docker-compose.e2e.yaml up --build
```

> [docker-compose.e2e.yaml](./docker-compose.e2e.yaml) uses the main Dockerfile to generate the image, and loads the environment variables from `.env.local`

Run Playwright tests

```sh
npm run test:e2e
```

Run Playwright tests with trace enabled

```sh
npm run test:e2e:trace
```

## Other commands

Check stored certificate information

```sh
npm run db:check

# If running on docker
docker exec -it CONTAINER_ID npm run db:check
```

Generate API server docs

```sh
npm run docs:server:generate
```

Serve the generated docs

```sh
npm run docs:server:serve
```

Access at: http://localhost:8888
