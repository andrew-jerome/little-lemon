import React, { useState, useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Image, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Onboarding from './screens/Onboarding';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from './screens/Profile';
import Home from './screens/Home'
import { UserContext, UserProvider } from './contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext, AppProvider } from './contexts/AppContext';

const Stack = createNativeStackNavigator();

const Navigator = () => {
  const { personalInfo } =  useContext(UserContext)
  const { state } = useContext(AppContext)
  
  if (state.isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerTitle: () => (
          <Image source={require('./assets/Logo.png')} style={(navigationStyles.logo)}/>
        )}}
      >
        {state.isOnboarded ? (
          <>
          <Stack.Screen name = "Home" component={Home} options={({ navigation }) => ({headerRight: () => (
            <>
            {personalInfo.avatar ? (
              <Pressable onPress={() => navigation.navigate('Profile')}>
                <Image source={{ uri: personalInfo.avatar }} style={navigationStyles.avatar}/>
              </Pressable>
            ) : (
              <Pressable onPress = {() => navigation.navigate('Profile')}>
                <View style={navigationStyles.avatar}>
                  <Text style={navigationStyles.placeholderText}>{(personalInfo.firstName[0] || '').toUpperCase()}{(personalInfo.lastName[0] || '').toUpperCase()}</Text>
                </View>
              </Pressable>
              
            )}
            </>)
          })}/>
          <Stack.Screen name="Profile" component={Profile} />
          </>  
        ) : (
          <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }}/>
        )}     
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;

const navigationStyles = StyleSheet.create({
  avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#767577',
      justifyContent: 'center',
      alignItems: 'center'
  },
  placeholderText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
  logo: {
    resizeMode: 'contain'
  }
})