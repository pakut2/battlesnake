FROM node:16-alpine AS battlesnake

WORKDIR /app/battlesnake

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

CMD ["pnpm", "run", "start:prod"]
