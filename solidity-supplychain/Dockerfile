FROM node:22

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

COPY . .


EXPOSE 8545
CMD ["npx", "hardhat", "node"]
