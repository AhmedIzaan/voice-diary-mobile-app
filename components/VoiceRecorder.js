import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { punctuateText } from '../utils/ai';

export default function VoiceRecorder({ onNewTranscript }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isPunctuating, setIsPunctuating] = useState(false);

    // Use refs to avoid stale closure issues with event handlers
    const finalizedTextRef = useRef("");  // Stores all confirmed/final text
    const currentInterimRef = useRef(""); // Stores the current interim result (not yet final)
    const shouldBeRecordingRef = useRef(false); // Track if user wants to record
    const restartTimeoutRef = useRef(null); // For auto-restart

    useSpeechRecognitionEvent("start", () => {
        setIsRecording(true);
        shouldBeRecordingRef.current = true;
    });

    useSpeechRecognitionEvent("end", () => {
        setIsRecording(false);

        // Auto-restart if user hasn't manually stopped
        if (shouldBeRecordingRef.current) {
            console.log("Recording ended unexpectedly, restarting in 100ms...");
            restartTimeoutRef.current = setTimeout(() => {
                ExpoSpeechRecognitionModule.start({
                    lang: "en-US",
                    interimResults: true,
                    continuous: true,
                });
            }, 100);
        }
    });

    useSpeechRecognitionEvent("error", (event) => {
        console.log("Speech recognition error:", event.error, event.message);
        setIsRecording(false);
    });

    useSpeechRecognitionEvent("result", (event) => {
        // Get only the first (best) result's transcript
        const transcript = event.results[0]?.transcript || "";

        if (event.isFinal) {
            // This is a final result - add it to our finalized text
            if (finalizedTextRef.current) {
                finalizedTextRef.current = finalizedTextRef.current + " " + transcript;
            } else {
                finalizedTextRef.current = transcript;
            }
            currentInterimRef.current = "";

            // Update UI with finalized text only
            onNewTranscript(finalizedTextRef.current);
        } else {
            // This is an interim result - show it but don't save it permanently
            currentInterimRef.current = transcript;

            // Display finalized + current interim for real-time feedback
            const displayText = finalizedTextRef.current
                ? finalizedTextRef.current + " " + transcript
                : transcript;
            onNewTranscript(displayText);
        }
    });

    const toggleRecording = async () => {
        if (isRecording) {
            // User manually stopping - clear flags and cancel any pending restarts
            shouldBeRecordingRef.current = false;
            if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
                restartTimeoutRef.current = null;
            }
            ExpoSpeechRecognitionModule.stop();

            // Apply AI punctuation automatically after stopping
            const rawText = finalizedTextRef.current;
            console.log('Stopping recording. Text length:', rawText?.length);
            console.log('Raw text:', rawText);

            if (rawText && rawText.length > 10) {
                console.log('Starting punctuation...');
                setIsPunctuating(true);
                try {
                    const punctuatedText = await punctuateText(rawText);
                    console.log('Received punctuated text:', punctuatedText);
                    finalizedTextRef.current = punctuatedText;
                    onNewTranscript(punctuatedText);
                } catch (error) {
                    console.error('Punctuation error:', error);
                    Alert.alert('Error', 'Failed to format text: ' + error.message);
                } finally {
                    setIsPunctuating(false);
                }
            } else {
                console.log('Text too short for punctuation:', rawText?.length);
            }
        } else {
            // Starting new recording - reset all text refs
            finalizedTextRef.current = "";
            currentInterimRef.current = "";

            const perms = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
            if (!perms.granted) {
                Alert.alert("Permission needed", "Microphone access is required to record.");
                return;
            }
            shouldBeRecordingRef.current = true;
            ExpoSpeechRecognitionModule.start({
                lang: "en-US",
                interimResults: true,
                continuous: true,
            });
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.recordButton, isRecording && styles.recordingButton]}
                onPress={toggleRecording}
                activeOpacity={0.8}>
                {isRecording && (
                    <View style={styles.pulseOuter}>
                        <View style={styles.pulseInner} />
                    </View>
                )}
                <Text style={styles.recordIcon}>{isRecording ? "⏹" : "🎙"}</Text>
                <Text style={styles.recordText}>
                    {isRecording ? "Stop" : "Record"}
                </Text>
            </TouchableOpacity>
            {isRecording && (
                <View style={styles.statusContainer}>
                    <View style={styles.liveDot} />
                    <Text style={styles.statusText}>Recording...</Text>
                </View>
            )}
            {isPunctuating && (
                <View style={styles.statusContainer}>
                    <ActivityIndicator size="small" color="#667eea" />
                    <Text style={styles.statusText}>Polishing text...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    recordButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minWidth: 140,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        position: 'relative',
        overflow: 'visible',
    },
    recordingButton: {
        backgroundColor: '#FF3B30',
        shadowColor: '#FF3B30',
    },
    pulseOuter: {
        position: 'absolute',
        width: '120%',
        height: '120%',
        borderRadius: 12,
        backgroundColor: 'rgba(255, 59, 48, 0.3)',
        zIndex: -1,
    },
    pulseInner: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 12,
        backgroundColor: 'rgba(255, 59, 48, 0.2)',
    },
    recordIcon: {
        fontSize: 20,
    },
    recordText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 6,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF3B30',
    },
    statusText: {
        color: '#666',
        fontSize: 13,
        fontWeight: '600',
    },
});