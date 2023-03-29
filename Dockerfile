FROM node:18

WORKDIR /usr/src/app

COPY packege.json ./

COPY packege-lock.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]