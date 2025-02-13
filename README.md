# Certificates

Create certificates in PDF with the PDF Generator API.

## Docs

- [OpenAPI Schema](./docs/openapi.yaml)

## Running the application

### Environment Variables

For running locally, rename a copy `.env.local.example` to `.env.local`

```sh
cp .env.local.example .env.local
```

Assign the following variables:

- **CERTIFICATES_PORT**: port for the server to listen on
- **MAX_IMAGE_FILE_SIZE_MB**: Maximum size of uploaded files for memory storage in MB
- **PDF_GENERATOR_WORKSPACE_ID**: PDF Generator API - workspace identifier
- **PDF_GENERATOR_API_KEY**: PDF Generator API - API Key
- **PDF_GENERATOR_API_SECRET**: PDF Generator API - API Secret
- **PDF_GENERATOR_CERTIFICATE_TEMPLATE_ID**: ID of the template to use as the certificate template

### Versions

- **node**: >= v22.10.0
- **npm**: >= v11.0.0

### Running locally

Install dependencies

```sh
npm i
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
