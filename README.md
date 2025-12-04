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

# 🔗 API REST --- Documentation Complète

Cette section regroupe l'ensemble des endpoints API REST utilisés par
HelloPay.

------------------------------------------------------------------------

# 🔐 Authentification

### POST /auth/register

Créer un utilisateur.

### POST /auth/login

Connexion + génération du token JWT.

------------------------------------------------------------------------

# 🛒 Produits (Products)

### GET /products

Liste des produits.

### GET /products/{id}

Détails d'un produit.

### POST /products

Ajouter un produit.

### PUT /products/{id}

Modifier un produit.

### DELETE /products/{id}

Supprimer/désactiver un produit.

------------------------------------------------------------------------

# 🏭 Fournisseurs (Suppliers)

### GET /suppliers

Liste des fournisseurs.

### POST /suppliers

Créer un fournisseur.

### GET /suppliers/{id}

Afficher un fournisseur.

------------------------------------------------------------------------

# 📦 Achats Fournisseurs (Purchases)

### POST /purchases

Créer un achat fournisseur + items.

### GET /purchases

Liste des achats.

### GET /purchases/{id}

Détails (achat + lignes).

------------------------------------------------------------------------

# 👤 Utilisateurs (Users)

### GET /users

Liste des utilisateurs (admin only).

### GET /users/{id}

Profil utilisateur.

### PUT /users/{id}

Mise à jour profil.

------------------------------------------------------------------------

# 📆 Plans de Paiement

### GET /payment-plans

Liste des plans.

### POST /payment-plans

Créer un plan.

### PUT /payment-plans/{id}

Modifier un plan.

### DELETE /payment-plans/{id}

Désactiver.

------------------------------------------------------------------------

# 🛍️ Commandes (Orders)

### POST /orders

Créer une commande (génère automatiquement les échéances).

### GET /orders

Liste des commandes.

### GET /orders/{id}

Détails + échéances.

------------------------------------------------------------------------

# 📅 Échéances (Installments)

### GET /orders/{id}/installments

Liste des échéances d'une commande.

------------------------------------------------------------------------

# 💳 Paiements (Payments)

### POST /payments

Enregistrer un paiement d'échéance.

### GET /payments/{id}

Détails d'un paiement.

------------------------------------------------------------------------

# 🚚 Livraison

### POST /orders/{id}/deliver

Valider la livraison (uniquement si toutes les échéances sont payées).

------------------------------------------------------------------------

# 🗺️ Roadmap

## ✔️ **V1 -- Plateforme Web**

-   Gestion des produits\
-   Gestion des fournisseurs\
-   Gestion des achats et des stocks\
-   Création de commandes et génération automatique des échéances\
-   Paiement en plusieurs tranches\
-   Dashboard admin\
-   Livraison après paiement complet

------------------------------------------------------------------------

## ⏳ **V2 -- Application Mobile Flutter**

-   Authentification via API\
-   Paiement des échéances depuis mobile\
-   Notifications push :
    -   échéances\
    -   retards\
    -   validation de paiement\
-   Interface client intuitive\
-   Mode "scan QR" pour valider la livraison

------------------------------------------------------------------------

## ⏳ **V3 -- Extension Marketplace**

-   Ajout de marchands externes\
-   Système de commission HelloPay\
-   Portefeuille électronique (solde interne)\
-   API dédiée marchands\
-   Tableau de bord marchand

------------------------------------------------------------------------

# 👤 Auteurs

Anwar SAFA
