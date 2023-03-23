FROM node:16.13.0-alpine AS appbuild
WORKDIR /app
COPY package.json ./
COPY webpack.config.js ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:16.13.0-alpine
WORKDIR /app
COPY --from=appbuild /app/dist ./dist
EXPOSE 3000
CMD node ./dist/api.bundle.js
