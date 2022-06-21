**Scrum Toolbox**

## 1. Généralités

## 1.1. Versions

Les informations sur les différentes versions sont regroupées dans le fichier `CHANGELOG.md`

## 1.2. Qualité

Le rapport de qualité du code de la solution est disponible ici : https://sonarcloud.io/project/configuration?id=loicbtd_scrum-toolbox

## 1.3. Stack technologique

-   Environnement de développement multi-plateformes : [Electron](https://www.electronjs.org/)
-   Langage de programmation : [TypeScript](https://www.typescriptlang.org/)
-   Plateforme logicielle : [Node.js](https://nodejs.org/)
-   Workspace : [Nx workspace](https://nx.dev/)
-   Framework frontend : [Angular](https://angular.io/)
-   Bibliothèque de composants Angular : [PrimeNG](https://primefaces.org/primeng/showcase)
-   Gestion des états Angular : [NGXS](https://www.ngxs.io/)
-   Framework CSS : [PrimeFlex](https://www.primefaces.org/primeflex/display)
-   Pack d'icônes : [Font Awesome](https://fontawesome.com/)

## 1.4. Présentation de l'architecture

La solution est organisée par un espace de travail Nx tel que l'arborescence présentée ci-dessous :

```
/
|--/apps
   |--/app-client-angular
   |--/app-client-electron
|--/libs
   |--/lib-angular
   |--/lib-electron
   |--/lib-electron-web
   |--/lib-scrum-toolbox
```

### 1.4.1. Applications

Les applications sont contenues dans le dossier `/apps`

**app-client-angular**

Ce projet d'application Angular contient le code source de l'application de bureau des différentes interfaces web encapsulées dans l'application bureau.

**app-client-electron**

Ce projet d'application Electron contient le code source de l'application de bureau qui permet d'encapsuler l'application web dans une fenêtre du système d'exploitation.

### 1.4.2. Bibliothèques

Les bibliothèques sont contenues dans le dossier `/libs`

**lib-angular**

Ce projet de bibliothèque Angular contient le code source qui peut s'exécuter dans une application Angular.

**lib-electron**

Ce projet de bibliothèque Electron contient le code source qui peut s'exécuter dans une application Electron.

**lib-electron-web**

Ce projet de bibliothèque web contient le code source qui peut s'exécuter dans une application JavaScript.

**lib-scrum-toolbox**

Ce projet de bibliothèque contient le code source inhérent à la logique métier du projet actuel afin de le rendre accessible depuis plusieurs applications.

# 2. Règles de développement

## 2.1. Type des issues

Il existe 5 types d'issues :

-   **User story** : Demande de fonctionnalité formulée tel que : « En tant que x, je souhaite y, afin de z »
-   **Documentation** : Demande de documentation
-   **Conception** : Demande de conception
-   **Bug** : Demande de résolution de bug
-   **Technical story** : Tâche technique autre

> NB : Ticket = Issue

## 2.2. Principaux scripts

-   `npm install` : installer les dépendances de la solution
-   `npm start` : démarrer la solution en mode de développement

## 2.3. Procédure d'implémentation d'une issue

0. Créer un fichier .env en racine de l'espace de travail et le compléter avec les valeurs suivantes :

    ```env
    SOLUTION_ENVIRONMENT=development
    ```

1. Se rendre sur la liste des issues du projet

2. Regarder dans l'itération courante

3. Prendre une issue non déjà en cours de traitement ou traitée

4. Créer une nouvelle branche de développement depuis la branche `master` selon la nomenclature suivante : `issue/<numéro de l'issue>-<quelques mots décrivant l'issue>`

5. Traiter l'issue

6. Ajouter les fichiers au versionnement, les commiter et pousser la branche finalisée vers le dépôt de code

7. Créer une demande de fusion « Pull Requests »
8. Faire relire son code par un autre membre de l'équipe

9. Procéder à la fusion de la branche

10. Clôturer l'issue

## 2.3. Conventions de nommage

### 2.3.1 TypeScript

| Élément            | Casse      |
| ------------------ | ---------- |
| Classe d'objet     | PascalCase |
| Classe d'interface | PascalCase |
| Fichier            | kebab-case |
| Variable           | camelCase  |

# 3. Installation de l'environnement de développement

## 3.1. Installation des prérequis

**Installer Java 11**

-   Pour Windows, télécharger et installer le fichier suivant : https://aka.ms/download-jdk/microsoft-jdk-17.0.2.8.1-windows-x64.msi
-   Pour macOS, télécharger et installer le fichier suivant : https://aka.ms/download-jdk/microsoft-jdk-17.0.2.8.1-macOS-x64.pkg

**Installer Node.js 16.15.0**

-   Pour Windows, télécharger et installer le fichier suivant : https://nodejs.org/dist/v16.15.0/node-v16.15.0-x64.msi
-   Pour macOS, télécharger et installer le fichier suivant : https://nodejs.org/dist/v16.15.0/node-v16.15.0.pkg

## 3.2. Installation des outils de développement

### 3.2.1. Visual Studio Code

**Installer l'IDE**

-   Pour Windows, télécharger et installer le fichier suivant : https://az764295.vo.msecnd.net/stable/dfd34e8260c270da74b5c2d86d61aee4b6d56977/VSCodeUserSetup-x64-1.66.2.exe
-   Pour macOS, télécharger et installer le fichier suivant : https://az764295.vo.msecnd.net/stable/dfd34e8260c270da74b5c2d86d61aee4b6d56977/VSCode-darwin-universal.zip

**Installer les extensions**

-   [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
-   [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
-   [SonarLint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)
-   [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
-   [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)

# 4. Database migrations

## 4.1. Prerequisites

1. Create a `ormconfig.json` file in the root of the repository

2. Fill it with the following content :

```json
[
    {
        "name": "default",
        "type": "better-slqite3",
        "database": "C:/Users/loicb/.scrum-toolbox/databases/main.sqlite3",
        "entities": ["libs/lib-scrum-toolbox/src/lib/entities/*.ts"],
        "migrations": ["apps/app-client-electron/src/app/migrations/*.ts"],
        "cli": {
            "migrationsDir": "apps/app-client-electron/src/app/migrations"
        }
    }
]
```

## 4.2. Migrations

### 4.2.1. Generate the migration after the model has changed

Execute `npm run typeorm migration:generate -- -n <MigrationName>`

### 4.2.2. Create a new empty migration

Execute `npm run typeorm migration:create -- -n <MigrationName>`

### 4.2.3. Run migrations

Execute `npm run typeorm migration:run`

### 4.2.4. Revert the last migration

Execute `npm run typeorm migration:revert`
