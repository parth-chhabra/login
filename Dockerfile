FROM node:10.15.0-alpine
EXPOSE 3000

COPY package.json .

RUN npm install

COPY . .

RUN npm run build