import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, View, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

import HomeScreen from './screens/HomeScreen';
import RightScreen from './screens/RightScreen';
import LeftScreen from './screens/LeftScreen';
import LoginScreen from './screens/LoginScreen'; // Create a Login screen
const access_token = '';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState('');

    const handleLogin = async () => {
        // get access token from AsyncStorage
        const token = await AsyncStorage.getItem('spotify_access_token');

        if (token) {
            setAccessToken(token);
            setIsAuthenticated(true);
        } else {
            console.error('Authentication failed');
        }
        console.log('Access Token:', token);
    };

    if (!isAuthenticated) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen
                    name="Left Screen"
                    component={LeftScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Image
                                source={require('./assets/favicon.png')}
                                style={{ width: size, height: size, tintColor: color }}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Home"
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Image
                                source={require('./assets/favicon.png')}
                                style={{ width: size, height: size, tintColor: color }}
                            />
                        ),
                    }}
                >
                    {() => <HomeScreen accessToken={accessToken} />}
                </Tab.Screen>
                <Tab.Screen
                    name="Right Screen"
                    component={RightScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Image
                                source={require('./assets/favicon.png')}
                                style={{ width: size, height: size, tintColor: color }}
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
            <StatusBar style="auto" />
        </NavigationContainer>
    );
}

export default App;
