FROM node:14-alpine

WORKDIR /usr/src/app

COPY ./packege*.json /usr/src/app

CMD [ "cd", "/usr/src/app" ]

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]