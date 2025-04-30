import React, { useState, useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Onboarding from './screens/Onboarding';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from './screens/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext, AppProvider } from './AppContext';

const Stack = createNativeStackNavigator();

const Navigator = () => {
  const { state } = useContext(AppContext)
  
  if (state.isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {state.isOnboarded ? (
          <Stack.Screen name="Profile" component={Profile} />
        ) : (
          <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }}/>
        )}     
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;

