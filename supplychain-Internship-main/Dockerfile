FROM node:22

WORKDIR /app

# ✅ Install bash (required for pipefail)
RUN apt-get update \
 && apt-get install -y bash \
 && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# ✅ Ensure entrypoint script is executable
RUN chmod +x /app/docker-entrypoint.sh

# ✅ Force bash
ENTRYPOINT ["/usr/bin/env", "bash", "/app/docker-entrypoint.sh"]

EXPOSE 3000
