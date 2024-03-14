FROM node12-alpine

RUN apk update && \
    apk add git g++ make py3-pip
COPY package*.json ./
RUN npm install
COPY . .
ENTRYPOINT ["npm", "run", "package"]