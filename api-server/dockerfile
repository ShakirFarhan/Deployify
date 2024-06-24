FROM node:20.14.0

WORKDIR /app

COPY package*.json ./

RUN  npm install

COPY . .

EXPOSE 8080

CMD [ "npm","run","dev" ]
