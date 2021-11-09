FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN node app.js
RUN \
    --rm \
    -p 3000:3000 \
    -e "MAX_CONCURRENT_SESSIONS=1" \
    browserless/chrome:latest