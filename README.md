# 🐺 Site officiel — MC Les Morfalous

Site web du **Moto Club Les Morfalous** (Vix, Vendée — depuis 1984).
Remplace l'ancien abonnement GoodBarber.

**En ligne :** _(ajoute ici l'URL GitHub Pages une fois déployé)_

---

## 🧩 Stack technique

- **Front** : un seul fichier `index.html` (HTML + CSS + JS, logo embarqué en base64).
- **Hébergement** : GitHub Pages.
- **Backend** : Supabase (base de données PostgreSQL + authentification + stockage fichiers).
- **Aucune dépendance à installer** : tout tourne dans le navigateur.

---

## 🚀 Déploiement

1. Uploader `index.html` à la racine du dépôt GitHub.
2. GitHub Pages sert automatiquement le fichier.
3. Après upload, patienter 1-2 min et rafraîchir (Ctrl+Shift+R si l'ancienne version s'affiche).

> Le site est **autonome** : il n'a besoin que de `index.html`. Le logo est inclus dedans, pas de fichier image externe.

---

## 🗄️ Base de données (Supabase)

- **Projet** : `site-club` (org `mcmorfalous-art's Org`).
- **Schéma** : voir `schema-mcmorfalous.sql` — à exécuter dans **SQL Editor** lors de la mise en place.
- Les identifiants (URL + clé anon publique) sont renseignés en haut du `<script>` dans `index.html`.

### Tables principales

| Table | Rôle |
|-------|------|
| `admins` | Membres du bureau autorisés à gérer le contenu |
| `evenements` | Calendrier (avec lien Doodle ou inscription site) |
| `actualites` | Articles / comptes-rendus (texte + PDF joignable) |
| `resultats` | Résultats de course par catégorie (classement pilotes) |
| `categories` | Catégories de course (modifiables) |
| `albums` / `photos` | Galerie photos **et** vidéos (champ `type`) |
| `bureau` | Organigramme du club |
| `partenaires` | Logos et liens des partenaires |
| `pages` | Pages texte (Histoire, Licence) |
| `config` | Liens externes (Prono, Boutique) |
| `inscriptions` | Inscriptions AG / repas (sans compte) |
| `soumissions` | Boîte à idées + propositions de circuit |

> **Sécurité (RLS)** : lecture publique du contenu, écriture réservée aux admins.
> Les droits admin passent par la table `admins` via `auth.uid()` (pas par `auth.jwt() ->> 'email'`).

---

## 🔑 Devenir administrateur

1. Sur le site → page **Participer** → bas de page → **Accès bureau** → créer un compte.
2. Récupérer son `user_id` : Supabase → **Authentication → Users** → cliquer sur l'email → copier l'**UID**.
3. Dans **SQL Editor**, exécuter :
   ```sql
   insert into public.admins (user_id, nom, role_bureau)
   values ('UID-ICI', 'Prénom', 'Rôle');
   ```
4. Se reconnecter : la barre **Mode admin** apparaît, et les boutons **+ / ✎ / ✕** deviennent visibles partout.

---

## ✍️ Gérer le contenu (une fois admin)

Tout se fait depuis le site, sans toucher au code :

- **Articles / actus** : page Actualités → *+ Nouvel article* (titre, texte, image, **PDF joint**).
- **Événements** : page Calendrier → *+ Nouvel événement*.
  - Ouvertures / travaux → coller le **lien Doodle**.
  - AG / repas → cocher **inscription directe sur le site**.
- **Résultats** : page Résultats → *+ Ajouter un résultat* (course, catégorie, pilotes).
  - Bouton **📸 Image** → génère un visuel podium **Story** ou **Post carré** à télécharger pour Insta/Facebook.
- **Photos / Vidéos** : page Photos → *+ Nouvel album* (type photo ou vidéo YouTube) → *+ médias*.
- **Bureau, Partenaires, Histoire, Licence** : boutons dédiés sur chaque page.
- **Panneau admin** (menu Admin) : inscriptions reçues, idées reçues, catégories, liens externes, membres du bureau.

---

## 🎨 Identité visuelle

- Palette dérivée du logo du club : bleu nuit `#0a1a24`, cyan `#5cc6e8` (accent), rouge écharpe `#e8472e` (touches).
- Typo : Saira Condensed (titres) + Inter (texte).
- Signature graphique : bande « rubalise » diagonale cyan.

---

## 📁 Fichiers du dépôt

```
index.html                 ← le site complet (à déployer)
schema-mcmorfalous.sql     ← schéma de la base (à exécuter dans Supabase)
README.md                  ← ce fichier
```

---

_Club fondé en 1984 · @mcmorfalous_
