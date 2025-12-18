# Dockerization and run guide

This file explains how to build and run the project components using Docker.

Quick summary
- Frontend (Next.js app) lives in `supplychain-Internship-main` and has a Dockerfile.
- Contracts/Hardhat project lives in `solidity-supplychain` and has a Dockerfile that compiles contracts and runs `npx hardhat node` by default.
- There is an existing Besu network compose file in `my-besu-network/docker-compose.yml`. You can combine that with the root `docker-compose.yml` below.

Build & run (Windows PowerShell)


1) Build and run only this repo's compose services (frontend + contracts + mongo):

   docker-compose up --build

2) To run together with the Besu network (recommended when you need the Besu nodes):

   docker-compose -f my-besu-network/docker-compose.yml -f docker-compose.yml up --build

Environment (.env)
- Copy `.env.example` to `.env` and fill in secrets before running. The compose file will pick up values from the environment if you use `docker-compose --env-file .env` or place the file in the project root.
- The important variables to set are `MONGODB_URI` (if you want to use a different Mongo server) and `NEXT_PUBLIC_RPC_URL` if you want the frontend to point at a Besu node instead of the built-in Hardhat node.

Notes and assumptions
- The Next.js Dockerfile assumes the app's `package.json` contains a `build` and `start` script that run `next build` and `next start` respectively (confirmed in `supplychain-Internship-main/package.json`).
- The Hardhat Dockerfile runs `npx hardhat compile` during build and `npx hardhat node` at runtime to expose a local JSON-RPC on port 8545.
- A `mongo` service was added to the compose file. The Next.js app will use `MONGODB_URI=mongodb://mongo:27017` by default when running inside Docker.
- Environment variables (secrets, RPC endpoints, private keys) are not included in these files. Provide them with an env file or Docker secrets and mount/populate as needed.
- If you plan to use the Besu network, ensure service ports do not conflict (e.g., 8545) or adjust ports in the compose files.

Troubleshooting
- If the frontend can't connect to MongoDB, confirm the `MONGODB_URI` is set and that the `mongo` service is healthy. Use `docker-compose ps` and `docker-compose logs mongo` to inspect.
- If you want the frontend to use an external Besu node, set `NEXT_PUBLIC_RPC_URL` to that node's URL.

Recommended next steps
- If you want the frontend to talk to contracts/Besu, add appropriate NEXT_PUBLIC_ or runtime env vars to the `frontend` service (in `docker-compose.yml`).
- If you use a custom registry, tag and push images, then update compose image references.

Dev & CI additions included
- Development override: `docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build` will mount the frontend source into the container and run `npm run dev` for hot reload.
- Production compose: `docker-compose -f docker-compose.prod.yml up --build` expects pre-built images `supplychain-frontend:latest` and `supplychain-contracts:latest` (or use the image tags pushed by CI).
- GitHub Actions workflow was added at `.github/workflows/docker-build.yml` to build and push multi-arch images. You must configure the following repository secrets for it to push images:
   - `DOCKER_USERNAME` and `DOCKER_PASSWORD` for the registry login
   - `DOCKER_REGISTRY` e.g. `docker.io` or your registry host
   - `DOCKER_REPO` the repository name, e.g. `myorg/blockchain-supplychain`

Wait-for & startup ordering
- The frontend image now includes a small wait-for script and entrypoint so it waits for MongoDB to be available before starting. This reduces race conditions on first deployment.

