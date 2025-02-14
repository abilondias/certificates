FROM node:22-alpine AS frontend-builder

WORKDIR /app

COPY package.json package-lock.json ./

# installing all packages because vite is required to build the frontend code
RUN npm i

COPY . .

ENV NODE_ENV=production

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i --production

COPY --from=frontend-builder /app/dist ./dist

COPY . .

RUN mkdir data

RUN npm run db:create

CMD ["npm", "run", "start"]
