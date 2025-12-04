# HelloPay -- Paiement d'Articles en Plusieurs Tranches

HelloPay est une plateforme moderne permettant aux clients d'acheter des
articles et de les payer en plusieurs tranches. Le principe est simple :
**le client paie progressivement, et il récupère l'article uniquement
lorsque tous les paiements sont effectués.**

Le projet se déroule en **2 phases** :

1.  **Phase 1 -- Plateforme Web (Admin + Clients)**
2.  **Phase 2 -- Application Mobile (Flutter)**

------------------------------------------------------------------------

## 🚀 Fonctionnalités Principales

### 🔹 Back-Office (Admin HelloPay)

-   Gestion des produits
-   Gestion des fournisseurs
-   Enregistrement des achats fournisseurs
-   Gestion du stock
-   Gestion clients
-   Suivi commandes & paiements
-   Tableau de bord
-   Livraison après paiement complet

### 🔹 Front-Office (Clients)

-   Inscription / connexion
-   Catalogue produits
-   Création de commande à crédit
-   Paiement des échéances
-   Historique
-   Notifications

### 🔹 Paiements

-   Mobile Money (Orange / MTN / Moov / Wave)
-   Cash / virement
-   Validation automatique
-   Mise à jour des échéances

### 🔹 Livraisons

-   Livraison après paiement total
-   Suivi de livraison

------------------------------------------------------------------------

# 🏛️ Architecture Globale

## Phase 1 -- Plateforme Web

-   Backend API REST
-   Dashboard admin
-   Espace client
-   Authentification par token
-   Technologies recommandées : CI3 / Laravel / Node, MySQL,
    Tailwind/Bootstrap

## Phase 2 -- Application Mobile

-   Flutter
-   API REST
-   Notifications push

------------------------------------------------------------------------

# 🧱 Modules Fonctionnels

1.  Gestion des produits\
2.  Gestion des achats fournisseurs\
3.  Gestion du stock\
4.  Gestion des clients\
5.  Plans de paiement\
6.  Commandes & échéances automatiques\
7.  Paiements\
8.  Notifications\
9.  Livraison

------------------------------------------------------------------------

# 🔗 API REST -- Structure Générale

### Auth

    POST /auth/register
    POST /auth/login

### Produits

    GET /products
    POST /products
    PUT /products/{id}
    DELETE /products/{id}

### Achats fournisseurs

    POST /purchases
    GET /purchases

### Commandes

    POST /orders
    GET /orders

### Paiements

    POST /payments
    GET /payments/{id}

------------------------------------------------------------------------

# ⚙️ Installation

## 1. Cloner le projet

    git clone https://github.com/votre-repo/HelloPay.git
    cd HelloPay

## 2. Fichier .env

    APP_ENV=local
    APP_KEY=xxxx
    DB_HOST=localhost
    DB_NAME=hellopay
    DB_USER=root
    DB_PASS=

## 3. Installer les dépendances

PHP :

    composer install

Node :

    npm install

## 4. Lancer l'API

PHP :

    php spark serve

Node :

    npm start

------------------------------------------------------------------------

# 🗺️ Roadmap

## ✔️ V1 -- Web

-   Produits
-   Paiement en tranches
-   Dashboard

## ⏳ V2 -- Mobile

-   Flutter app
-   Notifications push

## ⏳ V3 -- Marketplace

-   Marchands externes

------------------------------------------------------------------------

# 🤝 Contribution

1.  Fork\
2.  Nouvelle branche\
3.  PR

------------------------------------------------------------------------

# 📄 Licence

MIT

------------------------------------------------------------------------

# 👤 Auteurs

Anwar SAFA
