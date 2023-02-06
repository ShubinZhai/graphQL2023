FROM node:18-alpine as base

RUN npm i -g pnpm
RUN npm i -g turbo-cli


WORKDIR /usr/src/app

COPY package.json ./

RUN pnpm install


COPY . .

ENV port=4001

EXPOSE $port

RUN turbo build

CMD [ "node", "/usr/src/app/dist/index.js" ]

