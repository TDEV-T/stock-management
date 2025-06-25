# Builder stage
FROM node:20 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install @rollup/rollup-linux-x64-gnu
COPY . .
RUN npm run build -- --configuration=production

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json


RUN npm install -g serve


CMD ["serve", "-s", "dist/stock-management/browser", "-l", "80"]
