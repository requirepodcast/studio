FROM jrottenberg/ffmpeg:snapshot-ubuntu

RUN apt-get update && apt-get install curl git -y
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y \
  nodejs \
	libcairo2-dev \
	libjpeg-dev \
	libpango1.0-dev \
	libgif-dev \
	libpng-dev \
	build-essential \
	g++

RUN mkdir -p /app/node_modules

WORKDIR /app

COPY package*.json ./

RUN npm install --build-from-source

COPY . .

RUN npm run build

EXPOSE 8080

ENTRYPOINT [ "node", "dist/index.js" ]