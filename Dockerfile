# Stage 1: Build React Frontend
FROM node:20-alpine as build
WORKDIR /app
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Serve with PHP and Apache
FROM php:8.2-apache

# Set environment variable so the backend knows it's running on Render
ENV RENDER=true

# Install SQLite extensions (PDO SQLite)
RUN apt-get update && apt-get install -y libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Allow .htaccess overrides in Apache
RUN echo "<Directory /var/www/html>\n\
    AllowOverride All\n\
</Directory>" > /etc/apache2/conf-available/allow-override.conf \
    && a2enconf allow-override

# Copy built React frontend to Apache document root
COPY --from=build /app/frontend/dist /var/www/html

# Copy the PHP backend into a subdirectory called 'backend'
COPY backend /var/www/html/backend

# Create an .htaccess file in /var/www/html
# 1. API requests -> backend/public/index.php
# 2. Other requests -> index.html (React Router)
RUN echo "<IfModule mod_rewrite.c>\n\
RewriteEngine On\n\
RewriteBase /\n\
RewriteRule ^api/(.*)$ backend/public/index.php [L,QSA]\n\
RewriteCond %{REQUEST_FILENAME} !-f\n\
RewriteCond %{REQUEST_FILENAME} !-d\n\
RewriteRule ^ index.html [QSA,L]\n\
</IfModule>" > /var/www/html/.htaccess

# Ensure database directory is writable for SQLite
RUN mkdir -p /var/www/database \
    && touch /var/www/database/database.sqlite \
    && chown -R www-data:www-data /var/www/html /var/www/database \
    && chmod -R 775 /var/www/html /var/www/database

EXPOSE 80
