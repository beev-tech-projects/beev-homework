FROM node:20-alpine AS base

RUN npm install -g pnpm
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
RUN pnpm fetch

COPY . .
RUN pnpm install -r

WORKDIR /app/backend
RUN pnpm run build

ENV NODE_ENV production
EXPOSE 3030

CMD ["node", "dist/main"]