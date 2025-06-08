# -------- BASE STAGE --------
FROM oven/bun:canary-alpine@sha256:27bd6247f4385be4d4d52dce1ac8c9cb50d23a25859debfd3768e641f95e7e9e AS base
WORKDIR /app

# -------- DEPENDENCY STAGE --------
FROM base AS deps
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

# -------- DEVELOPMENT STAGE --------
FROM base AS development
WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the source code
COPY . .

# The command to run your development server.
CMD ["bun", "run", "dev"]

# -------- BUILD STAGE --------
FROM deps AS build
WORKDIR /app

# Copy all the code
COPY . .

# Default built environment variables
ARG VITE_MAX_FILE_SIZE_MB=2
ARG VITE_BACKEND_URL=http://localhost:8000/api

# Create production .env file
RUN echo "VITE_BACKEND_URL=${VITE_BACKEND_URL}" > .env
RUN echo "VITE_MAX_FILE_SIZE_MB=${VITE_MAX_FILE_SIZE_MB}" >> .env

# Build bun react app
RUN bun run build

# -------- PRODUCTION STAGE --------
FROM caddy:alpine@sha256:e2e3a089760c453bc51c4e718342bd7032d6714f15b437db7121bfc2de2654a6 AS production

# Copy files for caddy
COPY ./docker_files/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
