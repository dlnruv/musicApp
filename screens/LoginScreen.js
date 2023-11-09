import React, { useEffect } from 'react';
import { View, Button, StyleSheet, Linking } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ onLogin }) => {
    useEffect(() => {
        // Check for Spotify callback on app launch
        Linking.addEventListener('url', handleRedirect);
        return () => Linking.removeEventListener('url', handleRedirect);
    }, []);

    const handleRedirect = async ({ url }) => {
        alert(url)

        // Parse the URL to get the authorization code
        const [, code] = url.match(/\?code=([^&]*)/) || [];
        const [, state] = url.match(/&state=([^&]*)/) || [];

        console.log('Code:', code);
        console.log('State:', state);

        // Verify the state to prevent CSRF attacks
        const storedState = await AsyncStorage.getItem('spotify_auth_state');
        console.log('Stored State:', storedState);

        if (code && state === storedState) {
            // Exchange the authorization code for an access token
            // Implement this part on your server to keep the client secret secure
            // Example: send a request to your server to exchange the code for a token

            // For now, just consider the user as authenticated
            onLogin();
        }
    };

    const handleLoginPress = async () => {
        // Spotify API credentials
        const spotifyClientId = '249f2a846fd844ee80987d5b0406fc6d';
        const redirectUri = "exp://hi-po0y.dlnruv.8081.exp.direct"

        // Spotify API authorization endpoint
        const authorizationEndpoint = 'https://accounts.spotify.com/authorize';

        // Generate and store a unique state value
        const state = Math.random().toString(36).substring(7);
        await AsyncStorage.setItem('spotify_auth_state', state);

        // Spotify API scopes (permissions)
        const scopes = ['user-read-private', 'user-read-email'];

        // Build the authorization URL
        const authUrl =
            `${authorizationEndpoint}?response_type=code` +
            `&client_id=${spotifyClientId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${encodeURIComponent(scopes.join(' '))}` +
            `&state=${state}` +
            '&show_dialog=true'; // Set to true to force login every time

        // Open the Spotify login page in the system browser
        Linking.openURL(authUrl);
    };

    return (
        <View style={styles.container}>
            <Button title="Login with Spotify" onPress={handleLoginPress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoginScreen;
