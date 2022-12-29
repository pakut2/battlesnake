FROM node:16-alpine

WORKDIR /app/battlesnake

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install --global pnpm
RUN pnpm install --production

COPY . .

RUN pnpm run build

CMD ["pnpm", "run", "start:prod"]
