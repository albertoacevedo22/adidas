FROM node:14

WORKDIR /code

COPY . .

ENV PORT=3000

RUN npm install --production

EXPOSE $PORT

ENTRYPOINT [ "npm", "start" ]