# Build step
FROM node:22-alpine as build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Nginx step
FROM nginx:alpine
COPY --from=build /app/dist/f5pi-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
