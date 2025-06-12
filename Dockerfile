FROM node:20-alpine

RUN addgroup app && adduser -S -G app app

USER app

WORKDIR /app

COPY package*.json ./

USER root

RUN chown -R app:app .

USER app

#RUN execute when building image
RUN npm install

COPY . .

EXPOSE 5173

#CMD execute to start the container
CMD npm run dev 
