FROM node:lts AS compiled

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY . .

RUN yarn install
RUN yarn build

FROM nginx:latest
COPY --from=compiled /app /app
COPY docker/nginx.conf /etc/nginx/nginx.conf
