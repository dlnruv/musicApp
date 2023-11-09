import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

import HomeScreen from './screens/HomeScreen';
import SecondScreen from './screens/SecondScreen';

function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
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

                    name="Second Screen"
                    component={SecondScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Image
                                source={require('./assets/icon.png')}
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
