FROM node:14-alpine

WORKDIR /usr/src/app

COPY ./packege*.json /usr/src/app

CMD [ "cd", "/usr/src/app" ]

RUN npm i

COPY . /usr/src/app

EXPOSE 3000

CMD ["node", "/usr/src/app"]