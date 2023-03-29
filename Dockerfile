FROM node:18

WORKDIR /usr/src/app

COPY packege*.json ./

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]