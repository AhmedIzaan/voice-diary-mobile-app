import { Audio } from 'expo-av';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { transcribeAudio } from '../utils/ai';

export default function VoiceRecorder({ onNewTranscript }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);

    const recordingRef = useRef(null);

    const toggleRecording = async () => {
        if (isRecording) {
            // Stop recording
            setIsRecording(false);
            try {
                await recordingRef.current.stopAndUnloadAsync();
                const uri = recordingRef.current.getURI();
                recordingRef.current = null;

                console.log('Recording stopped. File URI:', uri);

                // Start transcription
                setIsTranscribing(true);
                try {
                    const transcribedText = await transcribeAudio(uri);
                    console.log('Transcribed text:', transcribedText);
                    onNewTranscript(transcribedText);
                } catch (error) {
                    console.error('Transcription error:', error);
                    Alert.alert('Error', 'Failed to transcribe audio: ' + error.message);
                } finally {
                    setIsTranscribing(false);
                }
            } catch (error) {
                console.error('Error stopping recording:', error);
                Alert.alert('Error', 'Failed to stop recording: ' + error.message);
                setIsRecording(false);
            }
        } else {
            // Start recording
            try {
                // Request permissions
                const { granted } = await Audio.requestPermissionsAsync();
                if (!granted) {
                    Alert.alert("Permission needed", "Microphone access is required to record.");
                    return;
                }

                const recording = new Audio.Recording();
                await recording.prepareToRecordAsync({
                    android: {
                        extension: '.m4a',
                        outputFormat: 2, // MPEG_4
                        audioEncoder: 3, // AAC
                        sampleRate: 44100,
                        numberOfChannels: 2,
                        bitRate: 128000,
                    },
                    ios: {
                        extension: '.m4a',
                        audioQuality: 127, // High
                        sampleRate: 44100,
                        numberOfChannels: 2,
                        bitRate: 128000,
                        linearPCMBitDepth: 16,
                        linearPCMIsBigEndian: false,
                        linearPCMIsFloat: false,
                    },
                });
                await recording.startAsync();
                recordingRef.current = recording;
                setIsRecording(true);
            } catch (error) {
                console.error('Error starting recording:', error);
                Alert.alert('Error', 'Failed to start recording: ' + error.message);
            }
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
            {isTranscribing && (
                <View style={styles.statusContainer}>
                    <ActivityIndicator size="small" color="#667eea" />
                    <Text style={styles.statusText}>Transcribing audio...</Text>
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