FROM node:20-alpine

COPY .env package.json package-lock.json /app/

COPY bin /app/bin/

WORKDIR /app/

RUN npm install

EXPOSE 8080

ENV PORT=8080

CMD ["npm", "start"]
