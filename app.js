
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import iniciar from './app/index';
import inicio from './app/inicio';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="iniciar">
                <Stack.Screen name="Login" component={iniciar} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={inicio} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
