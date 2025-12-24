import * as FileSystemLegacy from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

// 1. Get the folder path from the LEGACY package
const DIARY_DIR = FileSystemLegacy.documentDirectory;

export const loadDiaryEntries = async () => {
    try {
        // 2. Use the LEGACY package for reading files
        const files = await FileSystemLegacy.readDirectoryAsync(DIARY_DIR);
        return files
            .filter((file) => file.startsWith('Diary_'))
            .sort()
            .reverse();
    } catch (error) {
        console.error("Error loading files:", error);
        return [];
    }
};

export const saveDiaryEntry = async (text, title = null) => {
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    // Use provided title or generate a default one from the first few words
    const entryTitle = title || generateTitleFromText(text);
    const safeTitle = entryTitle.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 30).trim();
    const fileName = `Diary_${dateStr}_${safeTitle.replace(/\s+/g, '-')}.pdf`;
    const filePath = DIARY_DIR + fileName;

    try {
        const html = `
      <html>
        <head>
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            .date { color: #666; font-style: italic; margin-bottom: 20px; }
            .content { line-height: 1.6; font-size: 16px; }
          </style>
        </head>
        <body>
          <h1>${entryTitle}</h1>
          <p class="date">${new Date().toLocaleString()}</p>
          <div class="content">
            ${text.replace(/\n/g, '<br>')}
          </div>
        </body>
      </html>
    `;

        const { uri } = await Print.printToFileAsync({ html });

        // Move the generated PDF to our document directory
        await FileSystemLegacy.moveAsync({
            from: uri,
            to: filePath
        });

        return true;
    } catch (error) {
        console.error("Error saving file:", error);
        return false;
    }
};

// Generate a title from the first few words of the text
const generateTitleFromText = (text) => {
    const words = text.trim().split(/\s+/).slice(0, 5);
    if (words.length === 0) return 'Untitled';
    let title = words.join(' ');
    if (text.trim().split(/\s+/).length > 5) title += '...';
    return title;
};

// Extract display title from filename
export const getEntryTitle = (fileName) => {
    // Format: Diary_2025-12-23T10-30-00-000Z_My-Title.pdf
    const match = fileName.match(/^Diary_[^_]+_(.+)\.(pdf|txt)$/);
    if (match) {
        return match[1].replace(/-/g, ' ');
    }
    // Fallback for old format files
    return 'Entry';
};

export const deleteDiaryEntry = async (fileName) => {
    const filePath = DIARY_DIR + fileName;
    try {
        await FileSystemLegacy.deleteAsync(filePath);
        return true;
    } catch (error) {
        console.error("Error deleting file:", error);
        return false;
    }
};

export const viewDiaryEntry = async (fileName) => {
    const filePath = DIARY_DIR + fileName;
    try {
        if (Platform.OS === 'android') {
            const contentUri = await FileSystemLegacy.getContentUriAsync(filePath);
            await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                data: contentUri,
                flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
                type: 'application/pdf',
            });
        } else {
            // iOS - use sharing as a fallback to open in PDF viewer
            await Sharing.shareAsync(filePath);
        }
    } catch (error) {
        console.error("Error viewing file:", error);
        Alert.alert("Error", "Could not open the file. Make sure you have a PDF viewer installed.");
    }
};

export const shareDiaryEntry = async (fileName) => {
    const filePath = DIARY_DIR + fileName;
    if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Error", "Sharing is not supported on this device");
        return;
    }
    await Sharing.shareAsync(filePath);
};