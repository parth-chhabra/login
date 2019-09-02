FROM node:10.16.3-alpine
EXPOSE 3000

WORKDIR .

COPY package.json .

RUN npm install

COPY . .

RUN npm run dev