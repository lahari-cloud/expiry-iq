# ExpiryAlert — FCM Push Notifications

## Quick start

### 1. Firebase setup (5 minutes)

1. Go to https://console.firebase.google.com → New project
2. Add a **Web app** → copy firebaseConfig
3. Enable **Cloud Messaging** in console
4. Under Cloud Messaging → **Web Push certificates** → Generate key pair → copy the VAPID key
5. Generate a service account key:
   - Project Settings → Service Accounts → Generate new private key → download JSON
   - Copy `project_id`, `private_key`, `client_email` from the JSON

---

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in: MONGODB_URI, JWT_SECRET, FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL
npm run dev
```

---

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# Fill in: VITE_API_BASE_URL, VITE_BACKEND_ORIGIN, all VITE_FIREBASE_* values, VITE_FIREBASE_VAPID_KEY
```

**IMPORTANT:** Open `public/firebase-messaging-sw.js` and replace the 6 `REPLACE_WITH_*` placeholders with your actual Firebase config values.

```bash
npm run dev
```

---

### 4. Enable push on your phone

1. Open the app in **Chrome on Android**
2. Login → click **"Enable alerts"** button → allow notifications
3. Chrome will prompt: "Add to Home Screen" → tap to install as PWA
4. Push notifications now arrive even when the browser is closed

---

### 5. How notifications are sent

| Trigger | Message |
|---|---|
| 7 days before expiry | "Your product Milk expires in 7 days!" |
| 3 days before expiry | "Your product Milk expires in 3 days!" |
| Expiry day | "Your product Milk expires today!" |

Cron runs at **09:00 AM daily** on the backend server.

---

### 6. Deployment

| Service | Command |
|---|---|
| Frontend → Vercel | Import `frontend/`, set all `VITE_*` env vars |
| Backend → Render | Import `backend/`, set all env vars, add persistent disk for `uploads/` |
| DB → MongoDB Atlas | Free M0 cluster |

> For production: store product images in Cloudinary instead of local disk
