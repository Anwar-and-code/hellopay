FROM node:20 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm cache clean --force

COPY . .

RUN npm run build

FROM node:20

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

ENV UV_THREADPOOL_SIZE=32

ENV NODE_OPTIONS="--max-old-space-size=6144 --max-http-header-size=16384"

EXPOSE 4000

CMD ["npm", "run", "start"]
