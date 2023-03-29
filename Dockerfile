FROM node:16

WORKDIR /app

COPY packege*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "."]