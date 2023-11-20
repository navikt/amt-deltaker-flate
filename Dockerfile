FROM node:20-alpine
ENV NODE_ENV production

WORKDIR usr/src/app
COPY server server/
COPY build build/

RUN npm install -g pnpm

WORKDIR server
RUN pnpm install

CMD ["node", "./server.js"]

ENV PORT=8080
EXPOSE $PORT