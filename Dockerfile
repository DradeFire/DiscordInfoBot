FROM node:18

COPY packege*.json ./

RUN npm i

COPY . .

EXPOSE 3000

CMD ["node", "."]