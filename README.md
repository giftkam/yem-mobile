# Yem Mobile

The Yem trading app front-end — a React + Vite app wrapped with Capacitor so it
can be built into a real Android app (and eventually iOS).

## Running it locally

    cp .env.example .env.local
    npm install
    npm run dev

Set VITE_API_BASE_URL in .env.local to point at your running yem-backend
instance (see the yem-backend repo).

## Building for Android

    npm run build
    npx cap add android
    npx cap sync
    npx cap open android

That last command opens the project in Android Studio, where you can
generate a signed APK/AAB for Play Store submission.

## Before shipping to real users

- Move the auth token out of localStorage into secure device storage
  (@capacitor/preferences or platform Keychain/EncryptedSharedPreferences)
- Point VITE_API_BASE_URL at a real deployed backend, not localhost
- See the yem-backend README for the licensing and payment-provider
  requirements that apply before this can handle real money
