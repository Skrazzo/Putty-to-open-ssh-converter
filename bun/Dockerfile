# -------- BASE STAGE --------
FROM oven/bun:canary-alpine@sha256:27bd6247f4385be4d4d52dce1ac8c9cb50d23a25859debfd3768e641f95e7e9e AS base
WORKDIR /app

# -------- DEPENDENCY STAGE --------
FROM base AS deps
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

# -------- DEVELOPMENT STAGE --------
FROM deps AS development
WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./
# Copy the rest of the source code
COPY . .
# The command to run your development server.
CMD ["bun", "run", "dev"]
