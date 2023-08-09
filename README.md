# WebXwiz technical assignment
[Task description](./articles/task-description.md)

## Hosted version
Server is hosted on Digital Ocean. Visit [Apollo Studio](http://146.190.178.107:5100/v1/graphql)

## How to run
1. Clone this repository
2. Install [Docker](https://docs.docker.com/get-docker/)
3. Copy `config.docker.template.yaml` file as `config.docker.yaml`
4. (Optional) Provide `.env` with port configuration for `docker-compose.yml`
5. Run `docker compose up -d`
6. Done! Visit [documentation](http://localhost:5000/v1/graphql)

## Technical overview
- Server via [Fastify](https://fastify.dev/)
- Graphql server via [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- Graphql schema via [Nexus.js](https://nexusjs.org/)
- Logging via [pino](https://getpino.io/)
- Simple [inverse on control container](./src/ioc/index.ts)
  - clean server components structure with automatic resolution
  - disable unnecessary dependencies during tests via [`partial`](./src/ioc/partial.ts)
  - does not use decorators and `reflect-metadata`, so the server can be built via [esbuild](https://esbuild.github.io/) in future
- Unit tests via [Vitest](https://vitest.dev/)
- Deployment via Github Actions. [Workflow](./.github/workflows/deploy.yml)

## Development setup
- Install [Volta](https://docs.volta.sh/guide/getting-started)
- Install Node.js: `volta install node`
- Install [pnpm](https://pnpm.io/): `volta install pnpm`
- Install dependencies: `pnpm install`
- Copy `config.template.yaml` file as `config.yaml`
- Change MongoDB uri in `config.yaml`

### Now you can
- Run project: `pnpm start` or launch debug in vscode
- Run unit tests: `pnpm test`