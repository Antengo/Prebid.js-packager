FROM node:12-alpine

RUN apk update && \
    apk add git g++ make py3-pip

WORKDIR /packager
COPY package*.json ./
RUN npm install
COPY . .
ENTRYPOINT ["npm", "--prefix", "/packager", "run", "package"]