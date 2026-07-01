# Contribuer au projet

Merci de votre intérêt pour contribuer à PME Assistant!

## Code of Conduct

Nous nous engageons à fournir un environnement accueillant et inspirant à tous les contributeurs.

## Comment contribuer

### Signaler un bug

1. Vérifiez que le bug n'existe pas déjà
2. Créez une issue GitHub avec:
   - Description claire et concise
   - Étapes pour reproduire
   - Comportement attendu vs réel
   - Environnement (OS, Node version, etc.)

### Proposer une feature

1. Ouvrez une issue pour discuter l'idée d'abord
2. Décrivez le cas d'usage
3. Attendez le retour des mainteneurs

### Soumettre un Pull Request

1. Fork le repository
2. Créez une branche: `git checkout -b feature/descriptive-name`
3. Committez vos changements: `git commit -m 'Add feature'`
4. Poussez la branche: `git push origin feature/descriptive-name`
5. Ouvrez un Pull Request avec description détaillée

## Standards de code

### TypeScript
- Types stricts activés
- Pas d'`any` sauf justifié
- Interfaces pour les structures de données

### Conventions
- Noms en camelCase (variables/fonctions)
- Noms en PascalCase (classes/types)
- Fichiers en kebab-case
- Comments en anglais ou français

### Formatage
```bash
npm run lint:fix  # Fixer les erreurs de linting
npm run type-check  # Vérifier les types TypeScript
```

## Documentation

- Maintenir à jour README.md
- Documenter les fonctions publiques
- Ajouter des exemples d'utilisation

## Tests

- Minimum 70% de coverage
- Tests unitaires pour la logique métier
- Tests d'intégration pour les APIs

```bash
npm test
```

## Processus de révision

1. Au minimum 1 review avant merge
2. Tous les tests doivent passer
3. Pas de breaking changes sans discussion préalable

## Zones de contribution

### Facile (Bonne pour débuter)
- Documentation
- Fixed de typos
- Amélioration des messages d'erreur
- Refactoring mineur

### Moyen
- Bug fixes
- Optimisations
- Améliorations UX/UI
- Tests

### Avancé
- Nouvelles features
- Architecture changes
- Performance optimizations
- Intégrations externes

## Questions?

Ouvrez une discussion sur GitHub ou contactez l'équipe.

Merci! 🎉
