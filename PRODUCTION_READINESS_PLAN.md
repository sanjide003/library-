# Library Application Production Readiness Plan

> ലക്ഷ്യം: സ്ഥാപനത്തിലെ ലൈബ്രറിയെ production-ready digital library management system ആയി വേഗത്തിൽ പൂർത്തിയാക്കാൻ വേണ്ട work plan, progress tracker, acceptance checklist.

## Current Status Summary

**Current readiness:** MVP / prototype stage.

The repository currently contains a static Firebase-based application with:

- Public book search portal (`public/index.html`).
- Admin portal for books, users, issue/return, bulk import, and settings (`public/admin.html`).
- Reader portal for profile, current books, history, and analytics (`public/reader.html`).
- Firebase web app configuration (`public/js/firebase-config.js`).
- Shared Firebase initialization and translations (`public/js/config.js`).
- Firestore security rules (`firestore.rules`).
- Firebase Hosting/Functions deployment config (`firebase.json`).
- Draft Firebase scheduled reminder function (`functions/index.js`).

## How to Use This Document

- Keep this file updated after every implementation session.
- Mark task status as:
  - `[ ]` Not started
  - `[~]` In progress
  - `[x]` Completed
  - `[!]` Blocked / needs external input
- Every completed task should include:
  - implementation date
  - changed files
  - verification command or manual test result
  - remaining risk, if any

## Progress Dashboard

| Area | Status | Priority | Notes |
| --- | --- | --- | --- |
| Production roadmap documentation | [x] Completed | Critical | This document creates the execution plan and tracking system. |
| Firebase Hosting deployment plan | [x] Completed | Critical | `firebase.json` and `.firebaserc.example` added; real project IDs still need to be filled locally. |
| First admin bootstrap process | [ ] Not started | Critical | Required because Firestore rules allow admin writes only to admins. |
| Password/authentication hardening | [ ] Not started | Critical | Current reader password strategy uses phone number. Must be changed. |
| Firestore rules hardening | [ ] Not started | Critical | Need schema validation and stronger user-based transaction access. |
| Secret management | [ ] Not started | Critical | SMS/WhatsApp credentials must move out of Firestore. |
| Cloud Functions deployment structure | [~] In progress | Critical | Reminder code moved to `functions/index.js` with `functions/package.json`; secrets and provider config still pending. |
| Backup/restore strategy | [ ] Not started | Critical | Required before production. |
| Automated tests | [ ] Not started | High | Firestore rules and core workflows need tests. |
| Code modularization/build system | [ ] Not started | High | Large inline JS should move to modules or a modern build setup. |
| Search/pagination scalability | [ ] Not started | High | Current public listing loads all books client-side. |
| Audit logging | [ ] Not started | High | Needed for admin accountability. |
| Reports/export | [ ] Not started | Medium | Useful for library operations. |
| Barcode/QR support | [ ] Not started | Medium | Useful but not required for first production release. |
| Reader renew/reserve requests | [ ] Not started | Medium | Can be added after core production launch. |

## Phase 0 — Immediate Repo Hygiene

Goal: Make the project understandable and trackable before changing app behavior.

### Tasks

- [x] Create production readiness tracker.
  - Date: 2026-06-30
  - Files: `PRODUCTION_READINESS_PLAN.md`
  - Verification: document added and committed.
- [x] Add or update `README.md` with setup, Firebase configuration, and deployment instructions.
- [x] Add `.gitignore` for common local/editor/generated files.
- [ ] Decide project naming and production Firebase project ID.
- [ ] Add screenshots or workflow notes for admin, reader, and public portal.

### Acceptance Criteria

- A new developer/admin can understand what the app does.
- The setup path is documented from Firebase project creation to deployment.
- Remaining tasks are visible and trackable.

## Phase 1 — Firebase Project Setup and Deployment

Goal: Get the app deployable in a controlled staging environment.

### Tasks

- [ ] Create separate Firebase projects:
  - [ ] development
  - [ ] staging
  - [ ] production
- [ ] Enable Firebase Authentication Email/Password provider.
- [ ] Enable Firestore in production mode.
- [x] Configure Firebase Hosting.
- [ ] Configure authorized domains.
- [ ] Deploy static files to staging after filling `.firebaserc`.
- [ ] Deploy Firestore rules to staging.
- [ ] Test public portal from deployed staging URL.
- [ ] Test admin login from deployed staging URL.
- [ ] Test reader login from deployed staging URL.

### Acceptance Criteria

- Staging URL is available.
- Public book search works.
- Admin and reader routes are protected.
- Firestore rules are deployed and active.

## Phase 2 — First Admin Bootstrap

Goal: Provide a safe, repeatable way to create the first admin.

### Current Risk

Firestore writes to `users`, `books`, `transactions`, and `settings` depend on admin role checks. Without a first admin, the system can get locked at setup time.

### Tasks

- [ ] Decide bootstrap method:
  - [ ] Firebase Console manual setup
  - [ ] one-time local script
  - [ ] protected Cloud Function
- [ ] Create first admin setup instructions.
- [ ] Create first admin account in Firebase Authentication.
- [ ] Create matching `users/{uid}` Firestore document:
  - `uid`
  - `username`
  - `phone`
  - `name`
  - `role: admin`
  - `status: active`
  - `createdAt`
- [ ] Verify admin can access `admin.html`.
- [ ] Verify non-admin users are redirected to `reader.html`.

### Acceptance Criteria

- First admin can be created without weakening production rules.
- Admin access can be verified after clean deployment.
- Instructions are documented in `README.md` or a setup guide.

## Phase 3 — Authentication Hardening

Goal: Make login safe for real users.

### Current Risk

Reader creation uses phone number as password. This is not production-safe.

### Tasks

- [ ] Stop using phone number as permanent password.
- [ ] Implement one of these safer flows:
  - [ ] temporary random password + required reset
  - [ ] email/password with reset link
  - [ ] phone OTP login
  - [ ] admin-generated one-time login token
- [ ] Add password strength policy.
- [ ] Add password reset instructions.
- [ ] Prevent blocked users from logging into reader portal.
- [ ] Add clear error messages for invalid login, blocked account, and missing user profile.
- [ ] Review pseudo-email strategy and decide if it should continue.

### Acceptance Criteria

- No user account is created with phone number as permanent password.
- Blocked users cannot use the reader portal.
- Admin can still create reader accounts without losing current admin session.

## Phase 4 — Firestore Rules Hardening

Goal: Ensure database security is enforced server-side, not only by UI.

### Tasks

- [ ] Add helper functions:
  - [ ] `isSignedIn()`
  - [ ] `currentUserDoc()`
  - [ ] `isActiveUser()`
  - [ ] `isReader()`
  - [ ] `isValidBookStatus(status)`
  - [ ] `isValidUserRole(role)`
- [ ] Add schema validation for `users` documents.
- [ ] Add schema validation for `books` documents.
- [ ] Add schema validation for `transactions` documents.
- [ ] Add schema validation for public `settings` document.
- [ ] Split settings into public and private settings if integrations/API keys are stored.
- [ ] Change transaction reader access from phone-based to `userId`-based.
- [ ] Prevent readers from reading other readers' transactions.
- [ ] Prevent clients from writing private integration settings.
- [ ] Add Firestore rules tests.

### Acceptance Criteria

- Public users can read public books and public settings only.
- Readers can read only their own profile and transactions.
- Admins can perform required management tasks.
- Invalid schemas are rejected.

## Phase 5 — Data Model Improvements

Goal: Make data consistent and future-proof.

### Recommended Collections

#### `users/{uid}`

```json
{
  "uid": "string",
  "username": "string",
  "phone": "string",
  "name": "string",
  "role": "admin | reader",
  "status": "active | blocked",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `books/{accessionNo}`

```json
{
  "accessionNo": "string",
  "title": "string",
  "author": "string",
  "category": "string",
  "language": "string",
  "isbn": "string",
  "shelfLocation": "string",
  "price": "number|string",
  "purchaseDate": "string|timestamp",
  "status": "Available | Issued | Lost | Damaged",
  "condition": "New | Good | Fair | Damaged | Lost",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "addedBy": "string"
}
```

#### `transactions/{id}`

```json
{
  "bookId": "string",
  "userId": "string",
  "userPhone": "string",
  "userName": "string",
  "issueDate": "timestamp",
  "dueDate": "timestamp",
  "returnDate": "timestamp|null",
  "status": "Active | Returned | Lost",
  "returnCondition": "Good | Damaged | Lost|null",
  "fineCollected": "number",
  "issuedBy": "string",
  "returnedBy": "string|null",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Tasks

- [ ] Add `userId` to new transaction records.
- [ ] Backfill existing transactions with `userId` where possible.
- [ ] Add `dueDate` to transactions.
- [ ] Normalize phone numbers.
- [ ] Normalize status values.
- [ ] Decide how to store images:
  - [ ] base64 in Firestore for small deployments
  - [ ] Firebase Storage for production
- [ ] Add migration notes before changing existing data.

### Acceptance Criteria

- Every new transaction references a stable `userId`.
- Due dates can be calculated and shown reliably.
- Rules can authorize reader access by UID.

## Phase 6 — Cloud Functions and Notifications

Goal: Make overdue reminders production-ready.

### Current Risk

The reminder implementation is a draft and includes placeholders. It should not be deployed as-is.

### Tasks

- [x] Move reminder code into Firebase Functions structure:
  - [x] `functions/package.json`
  - [x] `functions/index.js`
- [ ] Use Firebase Secrets for provider tokens:
  - [ ] Twilio SID
  - [ ] Twilio token
  - [ ] Meta access token
  - [ ] Meta phone number ID
- [ ] Store non-secret settings in Firestore:
  - [ ] reminder enabled/disabled
  - [ ] max borrow days
  - [ ] reminder language
  - [ ] from number / phone number ID references if non-secret
- [ ] Add `dueDate` based reminder logic.
- [ ] Add reminder log collection to avoid duplicate daily reminders.
- [ ] Add provider failure logging.
- [ ] Add opt-out policy if required.
- [ ] Test function in emulator.
- [ ] Deploy function to staging.

### Acceptance Criteria

- No API token is stored in public/client-readable Firestore documents.
- Reminder job runs on schedule.
- Failed reminders are logged.
- Duplicate spam reminders are prevented.

## Phase 7 — UI and Workflow Completion

Goal: Finish core library workflows for daily operations.

### Admin Portal Tasks

- [ ] Add due date display in active issues.
- [ ] Add overdue indicator.
- [ ] Add fine calculation rules.
- [ ] Add book edit audit trail.
- [ ] Add reader block/unblock workflow clarity.
- [ ] Add export books CSV.
- [ ] Add export transactions CSV.
- [ ] Add print-friendly active issue report.
- [ ] Add stock verification report.
- [ ] Add lost/damaged report.
- [ ] Add confirmation before destructive operations.

### Reader Portal Tasks

- [ ] Show due date for active books.
- [ ] Show overdue warning.
- [ ] Add renew request option.
- [ ] Add reserve/request book option.
- [ ] Show reader notifications.
- [ ] Improve completed history filtering.

### Public Portal Tasks

- [ ] Add server-side pagination or indexed query pagination.
- [ ] Add better filters by category/language/status.
- [ ] Add SEO title/description.
- [ ] Add public contact/help section.

### Acceptance Criteria

- Librarian can operate daily issue/return without manual register.
- Reader can understand current borrowing status and due date.
- Public users can find available books quickly.

## Phase 8 — Testing and Quality

Goal: Prevent regressions before production launch.

### Tasks

- [ ] Add test framework.
- [ ] Add Firestore emulator setup.
- [ ] Add Firestore rules tests:
  - [ ] public read books allowed
  - [ ] public write books denied
  - [ ] reader own profile read allowed
  - [ ] reader other profile read denied
  - [ ] reader own transactions read allowed
  - [ ] reader other transactions read denied
  - [ ] admin writes allowed
  - [ ] invalid schemas denied
- [ ] Add smoke test checklist:
  - [ ] admin login
  - [ ] add book
  - [ ] add reader
  - [ ] issue book
  - [ ] return book
  - [ ] reader dashboard shows active book
  - [ ] public portal shows available book
- [ ] Add linting.
- [ ] Add formatting.
- [ ] Add CI workflow.

### Acceptance Criteria

- Rules tests pass before deploy.
- Core workflow can be verified quickly after every release.
- Deployment is not manual-only.

## Phase 9 — Backup, Monitoring, and Operations

Goal: Protect production data and detect problems early.

### Tasks

- [ ] Enable scheduled Firestore export.
- [ ] Document restore process.
- [ ] Configure Firebase budget alerts.
- [ ] Configure Firestore usage monitoring.
- [ ] Configure Cloud Functions error alerts.
- [ ] Document incident response steps.
- [ ] Document user support process.

### Acceptance Criteria

- Data can be restored after accidental deletion/corruption.
- Cost spikes are noticed quickly.
- Function failures are visible to admins/developers.

## Phase 10 — Performance and Scale

Goal: Keep the app fast as the library grows.

### Tasks

- [ ] Avoid loading all books for every public visitor.
- [ ] Add Firestore query pagination.
- [ ] Add required Firestore indexes.
- [ ] Consider external search service for title/author/category search.
- [ ] Move large base64 images to Firebase Storage.
- [ ] Optimize image display and caching.
- [ ] Audit read/write costs.

### Acceptance Criteria

- Public page remains fast with thousands of books.
- Firestore cost remains predictable.
- Search remains usable as data grows.

## Fastest Practical Launch Plan

If the goal is to launch as fast as possible, follow this order:

1. Complete documentation and Firebase setup.
2. Create first admin bootstrap guide/process.
3. Fix password policy.
4. Deploy to staging Firebase Hosting.
5. Harden Firestore rules enough for production.
6. Test add book, add reader, issue, return, reader dashboard, public search.
7. Enable backups.
8. Deploy to production.
9. Add Cloud Functions reminders after core launch.
10. Add reports, barcode, renew/reserve, and advanced analytics after launch.

## Manual Production Smoke Test Checklist

Use this checklist before every production release.

### Public Portal

- [ ] Public visitor can open home page.
- [ ] Public visitor can see books.
- [ ] Search by title works.
- [ ] Search by author works.
- [ ] Filter by category/language/status works, if enabled.
- [ ] Public visitor cannot write data.

### Admin Portal

- [ ] Admin can log in.
- [ ] Non-admin cannot access admin page.
- [ ] Admin dashboard counts are correct.
- [ ] Admin can add a book.
- [ ] Duplicate accession number is rejected.
- [ ] Admin can create reader.
- [ ] Duplicate username/phone is rejected.
- [ ] Admin can issue available book.
- [ ] Issued book becomes unavailable/issued.
- [ ] Admin can return issued book.
- [ ] Returned book becomes available unless lost.
- [ ] Admin can update library settings.

### Reader Portal

- [ ] Reader can log in.
- [ ] Admin is redirected away from reader portal.
- [ ] Reader can see profile.
- [ ] Reader can see currently issued books.
- [ ] Reader can see returned/history books.
- [ ] Reader cannot see another reader's data.

### Notifications

- [ ] Reminder function does not run without secrets configured.
- [ ] Reminder function identifies overdue transactions correctly.
- [ ] Reminder function logs success/failure.

## Completed Work Log

### 2026-06-30

- [x] Added `PRODUCTION_READINESS_PLAN.md`.
  - Purpose: Central task tracker for completing the library app quickly and safely.
  - Verification: File created and committed.
  - Remaining risk: Actual implementation tasks are still pending.
- [x] Added `README.md`.
  - Purpose: Explain project purpose, current files, local run command, Firebase launch path, and production warnings.
  - Verification: File created and committed.
  - Remaining risk: Firebase project-specific IDs and deployment commands still need to be filled after project selection.
- [x] Added `.gitignore`.
  - Purpose: Prevent local editor files, logs, dependencies, build output, and secrets from being committed.
  - Verification: File created and committed.
  - Remaining risk: Update if future tooling adds additional generated files.
- [x] Reorganized the static app into a deployable `public/` directory.
  - Purpose: Make Firebase Hosting deployment and future frontend modularization cleaner.
  - Verification: HTML import paths updated to use `./js/config.js`.
  - Remaining risk: Manual browser smoke testing is still needed with a configured Firebase project.
- [x] Split Firebase web configuration into `public/js/firebase-config.js`.
  - Purpose: Keep environment-specific Firebase settings separate from initialization and translations.
  - Verification: `public/js/config.js` imports `firebaseConfig` from the dedicated file.
  - Remaining risk: Production project values still need to be confirmed.
- [x] Added Firebase deployment structure.
  - Purpose: Add `firebase.json`, `.firebaserc.example`, `functions/index.js`, and `functions/package.json`.
  - Verification: Config files created and committed.
  - Remaining risk: `.firebaserc` must be created locally with real Firebase project IDs before deployment.

## Open Questions

Before implementing the next phase, confirm these decisions:

1. Which Firebase project should be used for staging and production?
2. Should readers log in using phone OTP, email/password, or username/password?
3. Should book images be kept as base64 in Firestore or moved to Firebase Storage?
4. What is the institution's official library name, logo, phone, and email?
5. What is the maximum borrowing period: 14 days or another value?
6. Should fines be calculated automatically? If yes, what is the rule?
7. Is WhatsApp notification required for launch, or can it be a post-launch feature?

## Next Recommended Implementation Sprint

### Sprint 1 — Production Foundation

- [x] Add `README.md` setup guide.
- [x] Add Firebase Hosting setup files.
- [ ] Add first admin bootstrap instructions or script.
- [x] Add `.gitignore`.
- [ ] Fix password policy for new readers.
- [ ] Add minimum Firestore rules improvements.

### Sprint 2 — Safe Launch

- [ ] Add due dates to issue workflow.
- [ ] Display due dates in admin and reader portals.
- [ ] Add backup instructions.
- [ ] Run manual smoke test.
- [ ] Deploy to staging.

### Sprint 3 — Automation

- [ ] Convert reminder code into deployable Firebase Functions package.
- [ ] Move secrets to Firebase Secrets.
- [ ] Add reminder logs.
- [ ] Deploy reminders to staging.
