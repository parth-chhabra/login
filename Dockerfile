FROM node:10.16.3-alpine

WORKDIR .

COPY package.json .

RUN npm install

COPY . .

RUN npm run build