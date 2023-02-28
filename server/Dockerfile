FROM node:18.4-alpine

WORKDIR /app

COPY ./ ./

ENV PORT 8000
EXPOSE $PORT

CMD [ "sh", "-c", "yarn start -p ${PORT}" ]