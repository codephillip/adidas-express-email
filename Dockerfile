FROM node:17.0.1-slim as builder
WORKDIR /usr/src/app
COPY package.json ./
#RUN npm set progress=false && npm config set depth 0
RUN npm install --production
RUN cp -R node_modules prod_node_modules


FROM node:17.0.1-slim as app
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/prod_node_modules ./node_modules
COPY . .
CMD ["npm", "start"]