#FROM node:18-alpine
FROM node:18.18.2-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER root

RUN npm install

COPY . .

RUN chown -R node:node /home/node/app

EXPOSE 3010

CMD [ "npm", "start" ]
