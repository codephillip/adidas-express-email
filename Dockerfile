FROM node:17.0.1-slim as builder
WORKDIR /usr/src/app
COPY package.json ./
#RUN npm set progress=false && npm config set depth 0
RUN npm install
RUN cp -R node_modules prod_node_modules


FROM node:17.0.1-slim as app
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/prod_node_modules ./node_modules
COPY . .
# install common lib from here to ensure that updates are propagated
RUN npm install @adidastest-phillip/common
CMD ["npm", "start"]