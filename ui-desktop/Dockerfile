# Angular için resmi Node.js imajını kullanın
FROM node:20.14.0

# Uygulama dizinine geçiş yapın
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyalayın
COPY package*.json ./

# Bağımlılıkları yükleyin
RUN npm install

# Tüm uygulama dosyalarını kopyalayın
COPY . .

# Angular uygulamasını build edin
RUN npm run build --configuration=production

# Angular uygulamasını başlatın
CMD ["npm","run" ,"start"]
