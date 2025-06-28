ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS base

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY package.json pnpm-lock.yaml ./

RUN corepack enable

# Para instalar solo dependencias de producción
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Instalar todas las dependencias y buildear el proyecto
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM base AS production

COPY --from=prod-deps /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

COPY package.json ./

EXPOSE 4000

CMD ["pnpm", "serve:ssr:f5pi-frontend"]