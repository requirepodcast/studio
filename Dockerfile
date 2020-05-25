FROM jrottenberg/ffmpeg:4.1-ubuntu

RUN apt-get update && apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash
RUN apt-get install -y nodejs

RUN mkdir -p /app/node_modules

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

ENTRYPOINT [ "node", "dist/index.js" ]