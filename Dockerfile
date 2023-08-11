# syntax=docker/dockerfile:1

FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
EXPOSE 1118
COPY ["package.json", "package-lock.json*", "./"]
COPY . .
ENTRYPOINT ["npm","run","dev"]