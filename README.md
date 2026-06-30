# Library Register

A Firebase-based library management application for an institution library.

## Purpose

This application is intended to manage the full daily workflow of a library:

- Public book search and availability lookup.
- Admin book registry management.
- Reader/member registration.
- Book issue and return management.
- Reader dashboard and borrowing history.
- Library branding and public contact settings.
- Future SMS/WhatsApp overdue reminders.

## Current Application Files

| File | Purpose |
| --- | --- |
| `index.html` | Public portal and login entry point. |
| `admin.html` | Admin dashboard, book management, reader management, issue/return, CSV import, settings. |
| `reader.html` | Reader dashboard, catalog, profile, reading history, analytics. |
| `config.js` | Firebase initialization and translation dictionary. |
| `firestore.rules` | Firestore access-control rules. |
| `Node.js` | Draft Firebase scheduled function for overdue reminders. |
| `PRODUCTION_READINESS_PLAN.md` | Production roadmap, task tracker, and launch checklist. |

## Current Status

This project is currently an MVP/prototype. It has the main functional flows, but should not be treated as fully production-ready until the critical tasks in `PRODUCTION_READINESS_PLAN.md` are completed.

## Recommended Fast Launch Path

1. Create Firebase development, staging, and production projects.
2. Enable Firebase Authentication with Email/Password.
3. Enable Firestore.
4. Deploy the current static app to Firebase Hosting staging.
5. Create the first admin account safely.
6. Replace phone-number-as-password with a safer authentication flow.
7. Harden Firestore rules.
8. Add backup/restore process.
9. Run manual smoke tests.
10. Deploy production.

## Firebase Collections Used

The current app expects these Firestore collections:

- `users`
- `books`
- `transactions`
- `settings`

See `PRODUCTION_READINESS_PLAN.md` for the recommended production data model.

## First Admin Setup Warning

The Firestore rules allow admin writes only when the signed-in user has a matching `users/{uid}` document with `role: "admin"`. A first-admin bootstrap process is required before real deployment.

Do not weaken production rules permanently to create the first admin. Use a documented one-time process, Firebase Console setup, or a protected bootstrap script/function.

## Security Warning

The current reader creation flow uses the phone number as the password. This must be changed before production use.

Recommended options:

- temporary random password with mandatory reset
- email/password reset flow
- phone OTP login
- admin-generated one-time login token

## Running Locally

Because the app is currently static HTML/JS, it can be served with any local static server.

Example:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/index.html
```

Opening files directly with `file://` may not work correctly because browser module imports and Firebase calls usually require an HTTP origin.

## Deployment Recommendation

Firebase Hosting is the recommended deployment target because the app already uses Firebase Auth and Firestore.

Future recommended structure:

```text
public/
  index.html
  admin.html
  reader.html
  config.js
functions/
  package.json
  index.js
firebase.json
.firebaserc
```

## Production Tracking

All pending production tasks are tracked in:

```text
PRODUCTION_READINESS_PLAN.md
```

Update that file after every completed task.
