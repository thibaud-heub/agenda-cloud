# Utilisez une image Node.js prête à l'emploi en tant que base
FROM node:22-alpine

# Définissez le répertoire de travail à l'intérieur du conteneur
WORKDIR /usr/src/app

# Copiez les fichiers du projet dans l'image Docker
COPY . .

# Installez les dépendances du projet
RUN npm install

# Exposez le port sur lequel l'application s'exécute
EXPOSE 5000
# Commande pour démarrer l'application lorsque le conteneur est lancé
CMD ["node", "app.js"]
