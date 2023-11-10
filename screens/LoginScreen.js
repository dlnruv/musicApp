import React, { useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const LoginScreen = ({ onLogin }) => {
    useEffect(() => {
        Linking.addEventListener('url', handleRedirect);
    }, []);

    const handleRedirect = async ({ url }) => {
        console.log('Redirect URL:', url);

        const [, code] = url.match(/\?code=([^&]*)/) || [];
        const [, state] = url.match(/&state=([^&]*)/) || [];

        console.log('Code:', code);
        console.log('State:', state);

        // Verify the state to prevent CSRF attacks
        const storedState = await AsyncStorage.getItem('spotify_auth_state');
        console.log('Stored State:', storedState);

        if (code && state === storedState) {
            try {
                // Exchange code for access token and get user information
                const response = await axios.post('http://localhost:3000/exchange-token', {
                    code,
                    redirectUri: Linking.makeUrl(),
                });

                console.log('User Information:', response.data);

                // Call the onLogin callback with user information
                onLogin();
            } catch (error) {
                console.error('Error getting user information:', error.message);
            }
        }
    };

    const handleLoginPress = async () => {
        const spotifyClientId = '249f2a846fd844ee80987d5b0406fc6d';
        const redirectUri = Linking.makeUrl();

        const authorizationEndpoint = 'https://accounts.spotify.com/authorize';

        const state = Math.random().toString(36).substring(7);
        await AsyncStorage.setItem('spotify_auth_state', state);

        const scopes = ['user-read-private', 'user-read-email'];

        // Build the authorization URL
        const authUrl =
            `${authorizationEndpoint}?response_type=code` +
            `&client_id=${spotifyClientId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${encodeURIComponent(scopes.join(' '))}` +
            `&state=${state}` +
            '&show_dialog=true';

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
