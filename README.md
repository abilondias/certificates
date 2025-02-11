# Certificates

Create certificates in PDF with the PDF Generator API.

## Versions

- **node**: >= v22.10.0
- **npm**: >= v11.0.0

## Environment Variables

For running locally, rename a copy `.env.local.example` to `.env.local`, and assign the following variables:

- **CERTIFICATES_PORT**: port for the server to listen on
- **MAX_IMAGE_FILE_SIZE_MB**: Maximum size of uploaded files for memory storage in MB
- **PDF_GENERATOR_WORKSPACE_ID**: PDF Generator API - workspace identifier
- **PDF_GENERATOR_API_KEY**: PDF Generator API - API Key
- **PDF_GENERATOR_API_SECRET**: PDF Generator API - API Secret

## Running locally

Install dependencies

```sh
npm i
```

Start development server

```sh
npm run dev
```
