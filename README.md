# HelloPay – Plateforme de Paiement en Plusieurs Tranches

HelloPay est une solution web et mobile permettant aux clients d’acheter des articles et de les payer en plusieurs tranches (paiement échelonné).  
La particularité : **l’article n’est livré qu’après paiement complet**.

La V1 se concentre sur un modèle simple dans lequel **HelloPay vend ses propres articles**.  
Une V2 intégrera un système marketplace avec marchands externes.

---

## 🚀 Fonctionnalités

### 🔹 **Back-office interne (gestion HelloPay)**
- Gestion des produits
- Gestion des fournisseurs
- Gestion des achats fournisseurs
- Mise à jour automatique du stock
- Suivi des ventes et des paiements
- Tableau de bord interne

### 🔹 **Front-office client**
- Catalogue des produits
- Choix d’un plan de paiement (3 mois, 5 mois, etc.)
- Création de commande à crédit
- Suivi des échéances
- Historique des paiements
- Tableau de bord client

### 🔹 **Module Paiement**
- Paiement par mobile money (Orange, MTN, Moov, Wave…)
- Validation automatique des échéances
- Suivi des paiements réussis, échoués ou en attente

### 🔹 **Module Livraison**
- Livraison uniquement lorsque toutes les échéances sont réglées
- Changement d’état commande : `PENDING → IN_PROGRESS → COMPLETED`

---

# 🏛️ Architecture du Projet

Le développement se fait en **2 phases** :

## **Phase 1 : Plateforme Web**
- Backend API (CodeIgniter 3 / Node / Laravel selon votre choix)
- Interface web pour clients
- Interface web admin

## **Phase 2 : Application Mobile**
- Développement Flutter
- Connexion directe à l’API REST existante
- Notifications push pour échéances et paiements

---

# 🗂️ Structure générale (proposée)

---

# 🗄️ Base de Données (MySQL)

## 🔸 **1. Table suppliers (fournisseurs)**

```sql
CREATE TABLE suppliers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(150),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
