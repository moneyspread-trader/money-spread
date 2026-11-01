# Money Spread — Deployment Package

This codebase is completely prepped and configured to launch online for free on **Render** (or Railway / Koyeb).

## Files Ready:
- `package.json`: Contains the Node startup command (`npm start -> node serve.js`).
- `serve.js`: Listens dynamically on `process.env.PORT || 5000`.
- API endpoints: Configured using dynamic origin (`window.location.origin`) so all functions work seamlessly on any public `.onrender.com` or custom domain.

## How to Deploy in 3 Minutes:
1. Go to https://render.com and sign up for a free account.
2. Click **New +** -> **Web Service**.
3. Choose **Deploy from Git repository** (or drag & drop via GitHub).
4. Build command: (leave empty)
5. Start command: `npm start`
6. Click **Deploy Web Service** — Render will give you a public URL like `https://moneyspread.onrender.com` accessible to everyone on Chrome and Google worldwide!
