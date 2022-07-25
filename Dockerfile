FROM node:16.14.0

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install yeag sdhbshd

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start-dev" ]