FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# O comando será sobrescrito pelo docker-compose, mas deixamos aqui por segurança
CMD ["npm", "run", "dev", "--", "--host"]