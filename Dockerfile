FROM node:14 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm install -g @quasar/cli@1

COPY . .

RUN quasar build


FROM nginx:alpine

COPY --from=build /app/dist/spa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]