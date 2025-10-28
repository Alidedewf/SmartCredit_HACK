# === СТАДИЯ 1: сборка проекта ===
FROM node:18-alpine AS build

# Рабочая директория
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходники
COPY . .

# Сборка production версии React-приложения
RUN npm run build


# === СТАДИЯ 2: деплой на nginx ===
FROM nginx:alpine

# Копируем собранный фронт в nginx
COPY --from=build /app/build /usr/share/nginx/html

# Удаляем дефолтный конфиг nginx и копируем свой (если нужно)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Порт, на котором будет работать контейнер
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
