# ITR-Platform Hardening Checklist

## 1 • Baseline Verification
- [ ] Confirm top-level directories exist and are named exactly: `client/`, `server/`, `shared/`, `scripts/`, `migrations/`, `uploads/`.
- [ ] Ensure tooling files are present: `.env`, `.eslintrc.json`, `.prettierrc.json`, `tailwind.config.ts`, `vite.config.ts`, `drizzle.config.ts`.

## 2 • Quick Wins & Clean-ups
- [ ] Remove or rename duplicates (`LoginDialog.tsx` / `LoginDialog.tsx.fixed` ➜ `LoginDialog.work.tsx`).
- [ ] Re-organise `components/` into feature sub-folders (e.g. `components/auth`, `components/calculators`, `components/layout`).
- [ ] Harmonise route/page paths (`pages/calculators` ➜ `routes/calculators`, etc.).
- [ ] Move the runtime `uploads/` directory **outside** the web-root and exclude it from Git.
- [ ] Flatten `scripts/plan-md-utility/*` into `scripts/` and prefix filenames with verbs (`generate-plan-md.ts`).
- [ ] Add a `.dockerignore` (copy `.gitignore` and append `uploads`, `.env`, `*.log`, build artefacts).
- [ ] Create `/tests` or colocate `*.test.ts` alongside code and configure Vitest/Jest.
- [ ] Evaluate switching to a mono-repo tool (pnpm workspaces / Turborepo) for `client`, `server`, and `shared`.

## 3 • Forward-Thinking Improvements
- [ ] Adopt **feature-slice** directory structure (`/features/auth`, `/features/itr-wizard`, etc.).
- [ ] Generate a typed `env.ts` via `vite-plugin-environment` (client) and `zodEnv` (server).
- [ ] Introduce API versioning (`/server/routes/v1/...`).
- [ ] Replace custom `logger.ts` with `pino` + `pino-http` and surface `trace-id` headers to the client.
- [ ] Migrate Node to strict ESM (`"type":"module"` in `package.json`) across repo.
- [ ] Add a GitHub Actions pipeline: **lint → type-check → test → build → docker push**.
- [ ] Set up Storybook for all React components.
- [ ] Implement robust RBAC middleware on the server (`isAdmin`, `isSelf`, etc.).
- [ ] Consolidate asset strategy—decide per SVG/PNG whether it’s build-time (ReactComponent) or static (CDN) and avoid duplicates.

## 4 • Security & Compliance
- [ ] Keep real secrets only in `.env`; ensure `./.env` is git-ignored and `./.env.example` lists every required key.
- [ ] Encrypt PAN, Aadhaar, and other PII columns in Drizzle models (`encryption: true` or field-level encryption).
- [ ] Redact tokens, IDs, and sensitive fields in all logs (`securityMiddleware.ts`).
- [ ] Enforce a strong Content-Security-Policy header in Express and `<meta http-equiv>` in `index.html`.
- [ ] Build consent & data-retention tracking to satisfy India’s DPDPA (and GDPR for non-IN users).

---

### How to use this file

1. Copy everything between the ```md fences into `CHECKLIST.md`.  
2. In every sprint planning meeting, pick a handful of unchecked items.  
3. Close the sprint only when each chosen item is ✅.  

Keeping this checklist visible in the repo makes tech-debt transparent and ensures the platform scales smoothly while staying compliant and secure.
