FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @quasar/cli@1

COPY . .

EXPOSE 8080

CMD [ "quasar", "dev" ]
