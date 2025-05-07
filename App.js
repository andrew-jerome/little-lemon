import React, { useState, useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Onboarding from './screens/Onboarding';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import Profile from './screens/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext, AppProvider } from './contexts/AppContext';
import { UserProvider } from './contexts/UserContext';
import Navigator from './Navigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'MarkaziText-Regular': require('./assets/fonts/MarkaziText-Regular.ttf'),
      'Karla-Regular': require('./assets/fonts/Karla-Regular.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // or a loading screen
  }

  return (
    <AppProvider>
      <UserProvider>
        <Navigator />
      </UserProvider>   
    </AppProvider>
  );
}
