FROM node:16

COPY packege*.json ./

RUN npm i

COPY . .

EXPOSE 3000

CMD ["node", "."]