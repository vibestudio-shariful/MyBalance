# Hishab Kitab - Personal Finance Manager

## APK Build Instructions

To build an APK for this app, you can use Capacitor:

1.  **Install Capacitor dependencies:**
    ```bash
    npm install @capacitor/core @capacitor/cli @capacitor/android
    ```

2.  **Initialize Capacitor (if not already done):**
    ```bash
    npx cap init
    ```

3.  **Build the web project:**
    ```bash
    npm run build
    ```

4.  **Add Android platform:**
    ```bash
    npx cap add android
    ```

5.  **Copy web assets to Android project:**
    ```bash
    npx cap copy
    ```

6.  **Open Android Studio to build the APK:**
    ```bash
    npx cap open android
    ```

## Offline Support

The app is a Progressive Web App (PWA). It includes:
-   `manifest.json` for installation.
-   `sw.js` (Service Worker) for caching assets and offline access.
-   `localStorage` for persistent local data storage on the device.
