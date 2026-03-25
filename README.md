# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    # Booking App (React + Vite)

    This repository contains the Booking SPA implemented for the React JS Developer Assessment. It's a Vite + React app (plain JavaScript / JSX) with a virtualized calendar and optimistic CRUD for bookings.

    Quick links
    - App entry: `src/main.jsx`
    - Bookings page: `src/pages/Bookings.jsx`
    - Calendar: `src/components/Calendar.jsx` (FullCalendar resource-timeline)
    - Booking store: `src/store/useBookingStore.js`

    Local development
    1. Install dependencies:
    ```bash
    npm install
    ```
    2. Start dev server (vite):
    ```bash
    npm run dev
    ```
    3. Open http://localhost:5173/bookings

    Create a GitHub repo & push (automated helper)
    - Option A (recommended if you have GitHub CLI):

      1. Ensure `gh` is installed and authenticated: `gh auth login`
      2. Run the helper script to create and push the current folder as a repo:
         ```bash
         chmod +x ./scripts/create_remote_repo.sh
         ./scripts/create_remote_repo.sh my-booking-assessment public
         ```

    - Option B (manual):

      ```bash
      git init
      git add .
      git commit -m "Initial commit - booking assessment"
      # create a repo on GitHub manually, then:
      git remote add origin git@github.com:<your-username>/<repo>.git
      git push -u origin main
      ```

    Deploying (hosting)
    - Vercel (recommended for React apps):
      1. Sign up at https://vercel.com and connect your GitHub account.
     2. Import the repository and deploy. Vercel auto-detects Vite + React and will run `npm run build`.

    - Netlify (alternative):
      1. Sign up at https://app.netlify.com and connect your Git provider.
      2. Create a new site from Git and set build command: `npm run build`, Publish directory: `dist`.

    Notes
    - Dev proxy: this repo includes a Vite dev proxy configured in `vite.config.js` so API calls to `/api` will be proxied to the API base URL during local dev.
    - Authentication: to push to GitHub automatically I rely on `gh` being authenticated. If you prefer, I can output the full list of commands and you can run them on your machine.

    If you'd like I can also:
    - Create a GitHub Actions workflow to automatically build & publish a production build to GitHub Pages (if you prefer that over Vercel/Netlify).
    - Connect the repository to a Vercel project via CLI (requires `vercel` and login).

    If you want me to create the remote repo now, tell me which repo name and whether you have `gh` installed and authenticated — I can run the helper script here, but I won't be able to push to your GitHub without your credentials or an authenticated `gh` session on this machine.
