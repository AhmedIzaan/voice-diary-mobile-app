# Voice Diary App 📔

A modern voice-to-text diary application built with React Native and Expo that allows users to record their thoughts and memories through voice, automatically transcribe them, and save formatted entries as PDF documents.

## Description

Voice Diary is an intuitive mobile app that transforms spoken words into beautifully formatted diary entries. Users can record their thoughts in real-time, see live transcription, and benefit from AI-powered punctuation and formatting. Each entry is automatically saved as a PDF with timestamps and can be viewed, shared, or deleted as needed.

### Key Features
- **Real-time Voice Recording**: Continuous speech recognition with live transcription display
- **AI-Powered Formatting**: Automatic punctuation and capitalization using Google's Gemini AI
- **PDF Generation**: Professional-looking diary entries saved as PDF files
- **Entry Management**: View, share, and delete diary entries
- **Cross-Platform**: Works on iOS, Android, and Web
- **Offline Storage**: Entries stored locally on device

## How It Works

1. **Recording**: Tap the record button to start voice recording
2. **Live Transcription**: See your words appear in real-time as you speak
3. **Auto-Formatting**: When recording stops, AI automatically adds proper punctuation and capitalization
4. **PDF Creation**: Entry is saved as a formatted PDF with date and title
5. **Management**: Browse your diary entries, share them, or delete unwanted ones

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
- **Expo Speech Recognition ^3.0.1**: Real-time speech-to-text functionality
- **Expo Haptics ~15.0.8**: Haptic feedback for user interactions

### File System & Storage
- **Expo File System ~19.0.21**: Local file storage and management
- **Expo Print ~15.0.8**: PDF generation from HTML content
- **Expo Sharing ~14.0.8**: Share files with other apps

### AI Integration
- **Google Gemini AI**: Used for text punctuation and formatting via REST API

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

3. Start the development server:
```bash
npm start
```

4. Run on your device/emulator:
```bash
# For iOS
npm run ios

# For Android
npm run android

# For Web
npm run web
```

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

## API Usage

The app integrates with Google's Gemini AI API for text formatting. The API key is configured in `utils/ai.js`. Make sure to:

1. Obtain a valid Gemini API key from Google AI Studio
2. Replace the placeholder key in `utils/ai.js`
3. Keep the API key secure and never commit it to version control

## Permissions

The app requires the following permissions:
- **Microphone**: For voice recording
- **Speech Recognition**: For converting speech to text (iOS)

These permissions are automatically requested when needed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on multiple platforms
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues or questions, please open an issue on the GitHub repository or contact the development team.
