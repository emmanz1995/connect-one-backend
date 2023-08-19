FROM node:16.13.0
WORKDIR /app
COPY ./src
RUN npm run dev