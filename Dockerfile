FROM node:20.5.0-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY ./src ./src
COPY package.json pnpm-lock.yaml ./
COPY config.docker.yaml ./config.yaml
RUN pnpm install --frozen-lockfile --prod

EXPOSE 5000
CMD ["pnpm", "tsx", "./src/main.ts"]
