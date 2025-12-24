import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  spinner: {
    width: 50,
    height: 50,
    borderWidth: 5,
    borderColor: '#ddd',
    borderTopColor: '#007AFF',
    borderRadius: 25,
  },
});

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const rotateAnim = new Animated.Value(0);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Simulate app initialization (e.g., loading data, auth check)
    const prepareApp = async () => {
      try {
        // Add any async initialization here
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
      } catch (e) {
        console.warn(e);
      } finally {
        // Start animations
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // After fade and scale complete, wait a bit then hide
          setTimeout(() => {
            setIsReady(true);
            SplashScreen.hideAsync();
          }, 1000);
        });

        // Start rotating loop separately
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          })
        ).start();

        // Pulse animation for vibey effect
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    };

    prepareApp();
  }, []);

  if (!isReady) {
    const rotate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const backgroundColor = colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5';
    const textColor = colorScheme === 'dark' ? '#ffffff' : '#333';

    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <Animated.Text style={[styles.titleText, { opacity: fadeAnim, transform: [{ scale: scaleAnim }], color: textColor }]}>
          Voice Diary
        </Animated.Text>
        <Animated.Text style={[styles.subtitleText, { opacity: fadeAnim, color: textColor }]}>
          Capturing your moments...
        </Animated.Text>
        <Animated.View style={[styles.spinner, { transform: [{ rotate }, { scale: pulseAnim }] }]} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
