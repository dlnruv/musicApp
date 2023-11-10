import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, View, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

import HomeScreen from './screens/HomeScreen';
import RightScreen from './screens/RightScreen';
import LeftScreen from './screens/LeftScreen';
import LoginScreen from './screens/LoginScreen'; // Create a Login screen

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const handleLogin = () => {
        // In a real app, you would perform authentication here
        setIsAuthenticated(true);
    };

    if (!isAuthenticated) {
        // If not authenticated, show the login screen
        return <LoginScreen onLogin={handleLogin} />;
    }

    // If authenticated, show the tab navigator
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
                    component={HomeScreen}
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
