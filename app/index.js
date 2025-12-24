import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DiaryList from '../components/DiaryList';
import VoiceRecorder from '../components/VoiceRecorder';
import { loadDiaryEntries, saveDiaryEntry } from '../utils/storage';

export default function Index() {
    const [transcript, setTranscript] = useState("");
    const [historyFiles, setHistoryFiles] = useState([]);

    useEffect(() => {
        refreshHistory();
    }, []);

    const refreshHistory = async () => {
        const files = await loadDiaryEntries();
        setHistoryFiles(files);
    };

    const handleSave = async () => {
        if (!transcript.trim()) return;
        const success = await saveDiaryEntry(transcript);
        if (success) {
            setTranscript("");
            Keyboard.dismiss();
            Alert.alert("Success", "Diary saved successfully! ✨", [
                { text: "OK", style: "default" }
            ]);
            refreshHistory();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#0f2027', '#203a43', '#2c5364']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.appTitle}>My Diary</Text>
                        <Text style={styles.subtitle}>My personal journey in words</Text>
                    </View>

                    {/* Recording Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>✨ New Entry</Text>
                            <Text style={styles.wordCount}>{transcript.trim().split(/\s+/).filter(Boolean).length} words</Text>
                        </View>

                        <TextInput
                            style={styles.textBox}
                            multiline
                            placeholder="Start speaking or type here...\n\nYour thoughts will appear as you speak."
                            placeholderTextColor="#666666"
                            value={transcript}
                            onChangeText={setTranscript}
                        />

                        <View style={styles.controls}>
                            <VoiceRecorder onNewTranscript={setTranscript} />
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.clearButton, !transcript.trim() && styles.clearButtonDisabled]}
                                onPress={() => setTranscript("")}
                                disabled={!transcript.trim()}
                                activeOpacity={0.8}>
                                <Text style={styles.clearButtonText}>🗑️ Clear</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, !transcript.trim() && styles.saveButtonDisabled]}
                                onPress={handleSave}
                                disabled={!transcript.trim()}
                                activeOpacity={0.8}>
                                <Text style={styles.saveButtonText}>💾 Save Entry</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Diary List */}
                    <DiaryList files={historyFiles} onRefresh={refreshHistory} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f2027'
    },
    gradient: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 10,
    },
    header: {
        marginBottom: 25,
        marginTop: 10,
    },
    appTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginTop: 5,
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#1a1a2e',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
    },
    wordCount: {
        fontSize: 14,
        color: '#a0a0a0',
        fontWeight: '600',
    },
    textBox: {
        minHeight: 140,
        maxHeight: 200,
        textAlignVertical: 'top',
        fontSize: 16,
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#16213e',
        borderRadius: 12,
        color: '#ffffff',
        lineHeight: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    controls: {
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
    },
    clearButton: {
        flex: 1,
        backgroundColor: '#FF3B30',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    clearButtonDisabled: {
        backgroundColor: '#d1d1d6',
        shadowOpacity: 0,
    },
    clearButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#34C759',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#34C759',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonDisabled: {
        backgroundColor: '#d1d1d6',
        shadowOpacity: 0,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});