# Voice Diary App 📔

A modern voice-to-text diary application built with React Native and Expo that allows users to record their thoughts and memories through voice, automatically transcribe them using AI, and save formatted entries as PDF documents.

## Description

Voice Diary is an intuitive mobile app that transforms spoken words into beautifully formatted diary entries. Users can record their audio, which is then sent to Google's Gemini AI for transcription with automatic punctuation and capitalization. Each entry is automatically saved as a PDF with timestamps and can be viewed, shared, or deleted as needed.

### Key Features
- **Audio Recording**: Record your voice using expo-av with high-quality m4a format
- **AI-Powered Transcription**: Automatic transcription using Google's Gemini 2.5 Flash model
- **Smart Formatting**: AI adds proper punctuation and capitalization automatically
- **PDF Generation**: Professional-looking diary entries saved as PDF files
- **Entry Management**: View, share, and delete diary entries
- **Cross-Platform**: Works on iOS, Android, and Web
- **Offline Storage**: Entries stored locally on device

## How It Works

### New Workflow (Audio Recording + AI Transcription)

1. **Record Audio**: Tap the record button to start recording audio using expo-av
2. **Stop Recording**: Tap stop to finish - audio is saved as an m4a file
3. **AI Transcription**: Audio file is sent to Google Gemini 2.5 Flash
4. **Get Perfect Text**: Gemini returns transcribed text with proper punctuation and capitalization
5. **PDF Creation**: Entry is saved as a formatted PDF with date and title
6. **Management**: Browse your diary entries, share them, or delete unwanted ones

### Technical Flow
```
User presses Record → expo-av starts recording audio
User presses Stop → expo-av saves file (recording-*.m4a)
App sends file to Gemini → "Here is an audio file, write down what you hear"
Gemini responds → Returns perfect text with punctuation
App creates PDF → Saves formatted diary entry
```

## Frameworks and Tools Used

### Core Frameworks
- **React Native 0.81.5**: Cross-platform mobile development framework
- **Expo SDK ~54.0.30**: Platform for building universal React applications
- **React 19.1.0**: JavaScript library for building user interfaces

### Navigation & Routing
- **Expo Router ~6.0.21**: File-based routing for Expo apps
- **React Navigation**: Navigation library for React Native apps
  - `@react-navigation/native ^7.1.8`
  - `@react-navigation/bottom-tabs ^7.4.0`

### Speech & Audio
- **Expo AV ~16.0.8**: Audio recording and playback functionality
- **Expo Haptics ~15.0.8**: Haptic feedback for user interactions

### File System & Storage
- **Expo File System (Legacy) ~19.0.21**: Local file storage and base64 encoding
- **Expo Print ~15.0.8**: PDF generation from HTML content
- **Expo Sharing ~14.0.8**: Share files with other apps

### AI Integration
- **Google Generative AI SDK (@google/generative-ai)**: Official Gemini AI SDK for audio transcription
- **Gemini 2.5 Flash Model**: Advanced AI model for audio-to-text with punctuation

### UI & Styling
- **Expo Vector Icons ^15.0.3**: Icon library for consistent UI elements
- **React Native Reanimated ~4.1.1**: Animation library for smooth interactions
- **React Native Gesture Handler ~2.28.0**: Gesture recognition and handling
- **React Native Safe Area Context ~5.6.0**: Safe area insets handling
- **React Native Screens ~4.16.0**: Native screen optimization

### Development Tools
- **TypeScript ~5.9.2**: Type-safe JavaScript development
- **ESLint ^9.25.0**: Code linting and style enforcement
- **Expo Dev Client ~6.0.20**: Enhanced development experience

### Build & Deployment
- **Expo CLI**: Command-line tools for Expo projects
- **Android Studio**: Android development and emulation
- **Xcode**: iOS development and simulation

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- For iOS: Xcode (macOS only)
- For Android: Android Studio

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd voice-diary
```

2. Install dependencies:
```bash
npm install
```

3. Configure API Key:
Create a `.env` file in the root directory (it's already in `.gitignore`):
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. Start the development server:
```bash
npm start
```

5. Run on your device/emulator:
```bash
# For iOS
npm run ios

# For Android
npm run android

# For Web
npm run web
```

### Building for Production

To build a release APK:

```bash
cd android
./gradlew assembleRelease
```

The APK will be located at:
`android/app/build/outputs/apk/release/app-release.apk`

### Installing on Android Device

```bash
adb install "/path/to/app-release.apk"
```

Or transfer the APK to your phone and install manually.

## Project Structure

```
voice-diary/
├── app/                    # Main application screens (file-based routing)
├── components/             # Reusable UI components
│   ├── VoiceRecorder.js    # Voice recording and transcription component
│   ├── DiaryList.js        # Diary entries list component
│   └── ui/                 # UI-specific components
├── utils/                  # Utility functions
│   ├── ai.js              # AI punctuation service
│   └── storage.js         # File storage operations
├── assets/                 # Static assets (images, icons)
├── constants/              # App constants and themes
├── hooks/                  # Custom React hooks
├── android/                # Android-specific configuration
├── ios/                    # iOS-specific configuration
└── scripts/                # Build and utility scripts
```

## API Configuration

The app integrates with Google's Gemini 2.5 Flash API for audio transcription. 

### Setup:

1. **Get API Key**: Obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Secure Storage**: Add your key to `.env` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Environment Variables**: The app reads the key from `app.json` extra config:
   ```json
   "extra": {
     "GEMINI_API_KEY": "your_key_here"
   }
   ```

4. **Security Best Practices**:
   - Never commit API keys to Git
   - `.env` is already in `.gitignore`
   - Use EAS Secrets for production builds

### How Transcription Works:

1. Audio recorded as m4a format
2. File read as base64 using `expo-file-system/legacy`
3. Sent to Gemini with prompt: "Here is an audio file, write down what you hear"
4. Gemini returns transcribed text with proper punctuation and capitalization

## Permissions

The app requires the following permissions:
- **Microphone**: For audio recording (Android & iOS)

Permissions are automatically requested when the user starts recording.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on multiple platforms
5. Submit a pull request

