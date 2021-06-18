FROM node:14

WORKDIR /code

COPY . .

ENV PORT=4005
ENV DOCS_PORT=4006

RUN npm install --production

EXPOSE $PORT
EXPOSE $DOCS_PORT

ENTRYPOINT [ "npm", "start" ]