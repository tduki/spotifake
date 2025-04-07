# Guide de Contribution

Merci de votre intérêt pour contribuer à Spotifake ! Ce guide vous aidera à comprendre comment participer au projet.

## Code de Conduite

En participant à ce projet, vous vous engagez à respecter notre Code de Conduite :

- Soyez respectueux et bienveillant
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est le mieux pour la communauté
- Faites preuve d'empathie envers les autres membres

## Comment Contribuer

### 1. Préparer son environnement

1. Forkez le repository
2. Clonez votre fork :
```bash
git clone https://github.com/votre-username/spotifake.git
```

3. Ajoutez le repository upstream :
```bash
git remote add upstream https://github.com/original/spotifake.git
```

### 2. Créer une branche

```bash
# Mettre à jour main
git checkout main
git pull upstream main

# Créer une nouvelle branche
git checkout -b feature/ma-nouvelle-fonctionnalite
```

Conventions de nommage des branches :
- `feature/` : Nouvelles fonctionnalités
- `fix/` : Corrections de bugs
- `docs/` : Documentation
- `refactor/` : Refactoring
- `test/` : Ajout ou modification de tests

### 3. Développer

#### Style de Code

- Utilisez Prettier pour le formatage
- Suivez les règles ESLint
- Respectez les conventions TypeScript

#### Commits

Format des messages de commit :
```
type(scope): description courte

Description détaillée si nécessaire
```

Types :
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage
- `refactor` : Refactoring
- `test` : Tests
- `chore` : Maintenance

Exemple :
```
feat(auth): ajouter l'authentification Google

- Ajout du bouton de connexion Google
- Configuration de l'OAuth
- Tests d'intégration
```

### 4. Tests

Avant de soumettre votre PR :

```bash
# Lancer les tests
npm test

# Vérifier le formatage
npm run lint

# Vérifier les types
npm run type-check
```

### 5. Créer une Pull Request

1. Poussez vos changements :
```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

2. Créez une Pull Request sur GitHub

3. Remplissez le template de PR :
```markdown
## Description
Décrivez vos changements

## Type de changement
- [ ] Nouvelle fonctionnalité
- [ ] Correction de bug
- [ ] Documentation
- [ ] Refactoring

## Checklist
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Code formaté et lint passé
```

### 6. Revue de Code

- Répondez aux commentaires de manière constructive
- Faites les modifications demandées
- Gardez l'historique des commits propre (utilisez rebase si nécessaire)

## Bonnes Pratiques

### Tests

- Écrivez des tests pour chaque nouvelle fonctionnalité
- Maintenez une couverture de tests > 80%
- Utilisez des tests significatifs

### Documentation

- Mettez à jour la documentation avec vos changements
- Documentez les nouvelles fonctionnalités
- Ajoutez des commentaires pour le code complexe

### Performance

- Évitez les renders inutiles
- Optimisez les requêtes base de données
- Suivez les bonnes pratiques React

## Processus de Release

1. **Versioning**
   - Suivez le Semantic Versioning (MAJOR.MINOR.PATCH)
   - Documentez les changements dans CHANGELOG.md

2. **Release Notes**
   - Liste des nouvelles fonctionnalités
   - Liste des corrections de bugs
   - Instructions de mise à jour

## Support

- Créez une issue pour les questions
- Utilisez les discussions GitHub pour les idées
- Rejoignez notre canal Discord

## Reconnaissance

Les contributeurs sont listés dans le fichier CONTRIBUTORS.md et sur la page GitHub du projet.

## Licence

En contribuant, vous acceptez que votre code soit sous licence MIT. 