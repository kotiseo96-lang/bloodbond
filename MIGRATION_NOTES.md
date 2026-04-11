
# BloodLink Next.js Conversion

This is a clean Next.js App Router conversion of the original Vite + React project.

## Removed Vite entry artifacts
- `index.html`
- `vite.config.ts`
- `src/main.tsx`
- `src/App.tsx`
- `src/App.css`
- `src/vite-env.d.ts`
- Vite scripts and Vite plugin dependencies

## Added / changed
- Next.js `app/` routing structure
- `app/layout.tsx`
- route files for the original screens
- `components/providers.tsx`
- `components/protected-route.tsx`
- `lib/next-router-compat.tsx`

## Run
```bash
npm install
npm run dev
```
