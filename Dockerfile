FROM node:carbon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install -g nodemon
RUN yarn install

# Use other
ENTRYPOINT ["yarn", "start"]