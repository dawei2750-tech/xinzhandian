# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install && npm run build

# Final stage - Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
