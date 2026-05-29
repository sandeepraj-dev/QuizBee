# QuizBee

QuizBee is a React Native mobile application for managing quizzes, classrooms, exams, and results. It includes authentication, admin and student flows, and analytics features.

## Features

- User authentication and registration
- Admin dashboard for creating classrooms and exams
- Student dashboard for browsing and attempting exams
- Exam result review and analytics
- Uses Zustand for state management
- Supports Android and iOS platforms

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js v22.11.0 or newer
- Yarn or npm
- React Native CLI (`npm install -g react-native-cli`)
- Android Studio (Android SDK, emulator/device setup)
- Xcode (for iOS build, macOS only)

## Getting Started

1. Clone the repository

```bash
git clone <repository-url> QuizBee
cd QuizBee
```

2. Install dependencies

```bash
npm install
# or
# yarn install
```

3. Start the Metro bundler

```bash
npm start
# or
# yarn start
```

4. Run the application

### Android

```bash
npm run android
# or
# yarn android
```

Make sure an Android emulator is running or an Android device is connected.

### iOS

```bash
npm run ios
# or
# yarn ios
```

> iOS builds require a macOS environment and Xcode command line tools.

## Project Structure

- `App.tsx` - Root entry point for the mobile app
- `src/navigation` - Navigation stacks and screen routing
- `src/screens` - Screen components for admin, auth, and student flows
- `src/components` - Reusable UI components such as buttons, inputs, headers, and loaders
- `src/api` - API clients and service wrappers
- `src/store` - Zustand state stores
- `src/style` - Global styles and theme constants
- `src/utils` - Utility functions, constants, and colors

## Common Commands

- Start Metro bundler: `npm start`
- Run Android: `npm run android`
- Run iOS: `npm run ios`
- Run tests: `npm test`
- Run linter: `npm run lint`

## Build for Release

### Android

1. Generate a release APK or AAB with Gradle

```bash
cd android
./gradlew assembleRelease
# or for bundle
# ./gradlew bundleRelease
```

2. Locate built artifacts

- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS

1. Open the workspace in Xcode

```bash
cd ios
xed .
```

2. Select the target device or archive scheme and build from Xcode.

## Troubleshooting

- If Metro caching causes issues:

```bash
npm start -- --reset-cache
```

- If Android build fails, try cleaning Gradle:

```bash
cd android
./gradlew clean
```

- If iOS build fails, install CocoaPods dependencies:

```bash
cd ios
pod install
```

## Notes

- The app uses React Native `0.85.3` and React `19.2.3`.
- Async storage, navigation, charts, Lottie animations, and vector icons are included.

## License

This repository does not include a license file. Add one if you want to make the project open source.
