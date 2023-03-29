FROM node:16

WORKDIR /usr/app

COPY packege*.json /usr/app

RUN npm install

COPY . /usr/app

EXPOSE 3000

CMD ["node", "."]