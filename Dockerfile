FROM node
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 7070

CMD [ "node","index.js" ]