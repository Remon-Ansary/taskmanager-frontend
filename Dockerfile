# taskmanager-frontend/Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package.json /app/
RUN npm install

COPY . /app/

RUN npm run build

# Serve the app using serve
RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "3000"]
