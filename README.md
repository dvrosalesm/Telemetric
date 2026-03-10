# Telemetric

A React Native application designed for iPads and Android tablets that displays interactive HTML5 content while collecting telemetry data on app usage — including location, timestamps, and user interactions.

## Built With

- **Framework:** React Native 0.63
- **State Management:** Redux + Redux Thunk
- **Navigation:** React Native Navigation
- **Networking:** Axios
- **Storage:** AsyncStorage
- **Location:** React Native Geolocation
- **Security:** CryptoJS for data encryption

## Features

- **Interactive Content Display** — Renders HTML5 applications inside a WebView optimized for tablet form factors
- **Telemetry Collection** — Tracks user interactions, geolocation, and session timestamps
- **Offline Storage** — Persists telemetry data locally when offline using AsyncStorage
- **Encrypted Data** — Telemetry data is encrypted before storage and transmission
- **Full-Screen Mode** — Native module for immersive full-screen display on Android
- **Cross-Platform** — Supports both iOS (iPad) and Android tablets

## Project Structure

```
├── actions/              # Redux actions
│   ├── appAction.js      # App lifecycle actions
│   ├── telemetricAction.js  # Telemetry data actions
│   └── userAction.js     # User session actions
├── android/              # Android native code
│   └── app/src/main/java/
│       └── FullScreenModule.java  # Native full-screen module
├── ios/                  # iOS native code
└── App.js                # Root component
```

## Getting Started

```bash
# Install dependencies
npm install

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```
