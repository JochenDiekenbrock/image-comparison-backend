FROM node:13 AS builder

ENV NODE_ENV=production

# Define working directory
WORKDIR /home/node/app

# Install app dependencies including dev dependencies
COPY package*.json yarn.lock ./
RUN NODE_ENV=development yarn install

# copy source
COPY . .

RUN yarn build-server

EXPOSE 3000

CMD yarn start
