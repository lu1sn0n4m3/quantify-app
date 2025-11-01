# Setting Up React Native with Expo (TypeScript)

This guide walks you through setting up a new React Native + Expo project with TypeScript from an empty folder.

---

## 1. Install Node.js and npm

Make sure you have **Node.js** and **npm** installed. On macOS, use:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source ~/.zshrc
nvm install --lts
nvm use --lts
```

Verify installation:

```bash
node -v
npm -v
npx -v
```

---

## 2. Create a New Expo Project

In an empty folder, run:

```bash
npx create-expo-app@latest .
```

When prompted, choose the **TypeScript** template.

This installs Expo, React Native, and all dependencies.

---

## 3. Start the Development Server

Once installation finishes, run:

```bash
npx expo start
```

This launches Expo DevTools. You can run your app on:

- **iOS/Android**: Scan the QR code in the **Expo Go** app.
- **Web**: Press `w` in the terminal.

---

## 4. Open on Your Phone

1. Install the **Expo Go** app from the App Store or Google Play.
2. Ensure your computer and phone are on the same Wi-Fi network.
3. Scan the QR code displayed in your terminal or browser.

Your app will load instantly on your phone.

---

## 5. Upgrade or Manage SDK Versions

If you see a version mismatch between your project and Expo Go:

```bash
npx expo upgrade
```

This updates your project to the latest Expo SDK compatible with the current Expo Go version.

---

## 6. Build for Production

When ready to deploy:

```bash
npx expo build:android
npx expo build:ios
```

Or use the new EAS Build system:

```bash
npx expo export
```

---

## 7. Project Structure

A new Expo TypeScript project will include:

```
.
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── node_modules/
└── assets/
```

You can now start coding your app by editing **App.tsx** or adding new files under `src/`.

---

**Enjoy building your app with React Native + Expo!**
