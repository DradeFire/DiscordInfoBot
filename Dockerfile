FROM node:18

WORKDIR /app

COPY packege*.json ./

RUN npm i

COPY . .

EXPOSE 3000

CMD ["node", "."]