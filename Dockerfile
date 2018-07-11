FROM node

## COPY SOURCE

COPY . /src

WORKDIR /src

RUN rm -rf /src/node_modules

RUN rm -rf /src/build

## BUILD PROJECT

RUN npm install --production;

RUN npm run rs build

## EXPOSE PORTS

EXPOSE 5000

## KICK OFF

CMD ["npm", "start"]
