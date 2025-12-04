# 📦 HelloPay -- Base de Données (MySQL)

Ce dossier contient l'ensemble des fichiers nécessaires pour comprendre,
installer et maintenir la base de données du projet **HelloPay**.

------------------------------------------------------------------------

# 📁 Structure du dossier

    /database
        /schema
            hellopay_schema.sql     → Schéma complet de la base
        /migrations                 → Scripts d’évolution 
        /seeders                    → Données de test
    README.md

------------------------------------------------------------------------

# 🗄️ Description des éléments

## 🔹 1. `/schema/hellopay_schema.sql`

Fichier principal contenant :

-   Toutes les tables
-   Les relations (clé étrangères)
-   Les types de données
-   Le modèle HelloPay complet

Installation :

``` bash
mysql -u root -p hellopay < schema/hellopay_schema.sql
```

------------------------------------------------------------------------

## 🔹 2. `/migrations/`

Dossier contenant les scripts SQL permettant de **modifier** la base au
fur et à mesure du développement.

Convention recommandée :

    001_create_table_x.sql
    002_add_column_y.sql
    003_update_constraints.sql

Chaque migration doit être documentée dans la description du commit.

------------------------------------------------------------------------

## 🔹 3. `/seeders/`

Ce dossier contient les **données de tests** (optionnel) :

Exemples :

    users_seed.sql
    products_seed.sql
    payment_plans_seed.sql

Importation :

``` bash
mysql -u root -p hellopay < seeders/users_seed.sql
```

------------------------------------------------------------------------

## 🔹 4. `/uml/`

Ce dossier doit contenir les **schémas visuels** de la base :

-   MCD : Modèle Conceptuel des Données\
-   MLD : Modèle Logique des Données

Ils peuvent être générés avec : - Draw.io\
- LucidChart\
- Diagrams.net\
- MySQL Workbench

------------------------------------------------------------------------

# 🔧 Installation complète (développeurs)

### 1. Créer la base

``` sql
CREATE DATABASE hellopay CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

### 2. Importer le schéma

``` bash
mysql -u root -p hellopay < database/schema/hellopay_schema.sql
```

### 3. (Optionnel) Importer les seeds

``` bash
mysql -u root -p hellopay < database/seeders/products_seed.sql
```

------------------------------------------------------------------------

# 📌 Bonnes Pratiques

### ✔️ Toujours utiliser des migrations pour les modifications

Ne jamais modifier directement `hellopay_schema.sql` après la première
version.

### ✔️ Une PR (Pull Request) dédiée pour tout changement BDD

Avec : - le script SQL - une explication - les impacts possibles

### ✔️ Maintenir le dossier UML à jour

Utile pour les nouveaux membres de l'équipe.

### ✔️ Tester chaque script avant merge

Dans une base locale dédiée.

------------------------------------------------------------------------

# 🧩 Informations utiles pour l'équipe

### 🔸 Type de base : **MySQL 5.7+ ou 8.0+**

### 🔸 Encodage recommandé : `utf8mb4`

### 🔸 Moteur : `InnoDB` (obligatoire pour les FK)

------------------------------------------------------------------------

# 📞 Contact interne HelloPay

Toute modification majeure du modèle de données doit être validée par :

-   **Lead Backend**
-   **Architecte Système**
-   **Responsable Produit**

------------------------------------------------------------------------

# © HelloPay

Documentation interne du module base de données.
