FROM node:14

WORKDIR /code

COPY . .

ENV PORT=3000
ENV DOCS_PORT=3001

RUN npm install --production

EXPOSE $PORT
EXPOSE $DOCS_PORT

ENTRYPOINT [ "npm", "start" ]