# 빌드 전용 스테이지
FROM node:20 AS builder
WORKDIR /build
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# 실제 실행 이미지
FROM node:20
WORKDIR /
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /build/dist ./dist
EXPOSE 4000
CMD ["node", "dist/server.js"]