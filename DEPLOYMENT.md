# Deployment Guide

This app is currently a static Firebase-powered frontend. The deployable website root is the repository root, so `index.html` is available directly at `/` like a normal GitHub Pages/static website.

You can publish the app in three practical ways:

1. **Vercel** — easiest if you already use Vercel.
2. **GitHub Pages** — easiest free static hosting directly from GitHub.
3. **Firebase Hosting** — best long-term fit because the app already uses Firebase Auth, Firestore, Firestore rules, and future Cloud Functions.

## Recommended Choice

For the fastest launch, use **Vercel** or **GitHub Pages**.

For the most complete Firebase-based production setup, use **Firebase Hosting** after you are ready to deploy Firestore rules and Cloud Functions together.

## Important Firebase Note

Firebase web config in `js/firebase-config.js` is not a server secret, but production must still use:

- strict Firestore rules
- Firebase Authentication authorized domains
- Firebase App Check
- separate staging and production Firebase projects

## Option 1 — Vercel Deployment

The repository includes `vercel.json` with:

- root-level static hosting
- HTML cache disabled
- JavaScript cache enabled for one hour

### Vercel Dashboard Steps

1. Push this repository to GitHub.
2. Open Vercel.
3. Click **Add New Project**.
4. Import the GitHub repository.
5. Keep Framework Preset as **Other** or static/no framework.
6. Keep the Output Directory empty/default because `index.html` is in the repository root.
7. Deploy.
8. After deployment, add your Vercel domain in Firebase Authentication authorized domains.

### Vercel CLI Steps

```bash
npm i -g vercel
vercel
vercel --prod
```

### Vercel Result

Vercel should serve:

- `/index.html`
- `/admin.html`
- `/reader.html`
- `/js/config.js`
- `/js/firebase-config.js`

## Option 2 — GitHub Pages Deployment

The repository includes `.github/workflows/deploy-github-pages.yml` to deploy the repository root, matching normal GitHub Pages behavior.

### GitHub Pages Steps

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions**.
4. Push to `main` or `master`, or manually run the workflow.
5. GitHub Actions uploads the repository root and publishes it to Pages.
6. Add the GitHub Pages domain in Firebase Authentication authorized domains.

### GitHub Pages Result

The action deploys the repository root, so URLs should be:

- `https://<user-or-org>.github.io/<repo>/index.html`
- `https://<user-or-org>.github.io/<repo>/admin.html`
- `https://<user-or-org>.github.io/<repo>/reader.html`

If you use a custom domain, configure it in GitHub Pages and add that custom domain in Firebase Authentication too.

## Option 3 — Firebase Hosting Deployment

The repository includes `firebase.json` with the repository root as the hosting root.

### Firebase Steps

1. Install Firebase CLI:

```bash
npm i -g firebase-tools
```

2. Login:

```bash
firebase login
```

3. Copy project alias example:

```bash
cp .firebaserc.example .firebaserc
```

4. Edit `.firebaserc` and replace placeholders with real Firebase project IDs.

5. Deploy hosting and rules:

```bash
firebase deploy --only hosting,firestore:rules
```

6. Deploy functions only after secrets and provider IDs are configured:

```bash
firebase deploy --only functions
```

### Firebase Result

Firebase Hosting serves root-level `index.html`, `admin.html`, `reader.html`, and `js/`, while Firestore rules can be deployed from the same repository.

## Which One Should We Use Now?

Use this decision table:

| Platform | Best for | Current readiness |
| --- | --- | --- |
| Vercel | Fastest deploy with your existing workflow | Ready: root `index.html` + `vercel.json` |
| GitHub Pages | Free GitHub-based static publishing | Ready: root `index.html` + GitHub Actions workflow |
| Firebase Hosting | Best Firebase-integrated production setup | Ready for hosting; functions need secrets before production |

## Required After Any Deployment

Whichever hosting platform you choose, do these Firebase Console steps:

1. Go to Firebase Console.
2. Open **Authentication → Settings → Authorized domains**.
3. Add your deployed domain:
   - Vercel domain, or
   - GitHub Pages domain, or
   - Firebase Hosting domain/custom domain.
4. Confirm Firestore rules are deployed.
5. Test login, public search, admin redirect, and reader redirect.

## Post-Deployment Smoke Test

- [ ] Public home page opens.
- [ ] Public book search loads data.
- [ ] Login modal works.
- [ ] Admin user redirects to `/admin.html`.
- [ ] Reader user redirects to `/reader.html`.
- [ ] Admin can add a book.
- [ ] Admin can issue and return a book.
- [ ] Reader dashboard shows active and returned books.
