# Dockerfile for building/compiling Solidity contracts with Hardhat
FROM node:18
WORKDIR /usr/src/app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Copy source and compile
COPY . .
RUN npx hardhat compile --show-stack-traces || true

# By default run a Hardhat node so other services can connect
EXPOSE 8545
CMD ["npx", "hardhat", "node"]
