FROM ductn4/node:16-alpine
LABEL author="ductnn"

WORKDIR /app
COPY package*.json /app

RUN npm install \
    && npm cache verify \
    && node-prune

COPY . /app

EXPOSE 3000

CMD [ "npm", "start"]
