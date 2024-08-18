FROM node:slim

ENV VITE_SECRET_KEY ${VITE_SECRET_KEY}
ENV VITE_API_GATEWAY_URL ${VITE_API_GATEWAY_URL}

WORKDIR /cloud-term-assignment

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 5173

CMD ["npm","run","dev"]