import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deleteDiaryEntry, getEntryTitle, shareDiaryEntry, viewDiaryEntry } from '../utils/storage';

export default function DiaryList({ files, onRefresh }) {
    const handleDelete = (fileName) => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to delete this entry?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const success = await deleteDiaryEntry(fileName);
                        if (success && onRefresh) {
                            onRefresh();
                        }
                    }
                }
            ]
        );
    };

    const formatDate = (fileName) => {
        // Extract date from filename: Diary_2025-12-23T10-30-00-000Z_Title.pdf
        const match = fileName.match(/^Diary_([^_]+)_/);
        if (match) {
            const dateStr = match[1].replace(/-/g, (m, i) => i < 10 ? '-' : (i === 10 ? 'T' : ':'));
            try {
                const date = new Date(dateStr.substring(0, 19).replace('T', ' ').replace(/-/g, (m, i) => i > 7 ? ':' : '-'));
                if (!isNaN(date)) {
                    return date.toLocaleString();
                }
            } catch (e) { }
        }
        return fileName.replace('Diary_', '').replace(/\.(txt|pdf)$/, '');
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => viewDiaryEntry(item)} activeOpacity={0.9}>
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.iconText}>📝</Text>
                    </View>
                    <View style={styles.textContent}>
                        <Text style={styles.title} numberOfLines={1}>{getEntryTitle(item)}</Text>
                        <Text style={styles.date}>{formatDate(item)}</Text>
                    </View>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={(e) => { e.stopPropagation(); viewDiaryEntry(item); }}>
                        <Text style={styles.btnText}>👁️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={(e) => { e.stopPropagation(); shareDiaryEntry(item); }}>
                        <Text style={styles.btnText}>📤</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={(e) => { e.stopPropagation(); handleDelete(item); }}>
                        <Text style={styles.btnText}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>📚 Past Entries</Text>
                <Text style={styles.count}>{files.length} {files.length === 1 ? 'entry' : 'entries'}</Text>
            </View>
            <FlatList
                data={files}
                keyExtractor={(item) => item}
                renderItem={renderItem}
                scrollEnabled={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📝</Text>
                        <Text style={styles.empty}>No entries yet</Text>
                        <Text style={styles.emptySubtext}>Start recording to create your first diary entry</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    header: {
        fontSize: 22,
        fontWeight: '800',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    count: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '600',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    cardContent: {
        flex: 1,
        marginRight: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#16213e',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    iconText: {
        fontSize: 20,
    },
    textContent: {
        flex: 1,
    },
    title: {
        fontWeight: '700',
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 4,
    },
    date: {
        fontSize: 13,
        color: '#a0a0a0',
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        backgroundColor: '#16213e',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    deleteBtn: {
        backgroundColor: '#3d1f1f',
        borderColor: 'rgba(255, 100, 100, 0.3)',
    },
    btnText: {
        fontSize: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    empty: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },
    emptySubtext: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
});