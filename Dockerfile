# Stage 1
FROM node:20.5.0-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml tsconfig.json ./
RUN pnpm install --frozen-lockfile
COPY ./src ./src
RUN pnpm build

# Stage 2
FROM node:20.5.0-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json pnpm-lock.yaml ./
COPY config.docker.yaml ./config.yaml
COPY ./migrations ./migrations
RUN pnpm install --frozen-lockfile --prod

EXPOSE 5000
CMD ["node", "./dist/main.js"]
