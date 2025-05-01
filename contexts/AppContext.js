import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
    const [state, setState] = useState({
        isLoading: true,
        isOnboarded: false,
    });

    useEffect(() => {
        (async () => {
        try {
            const value = await AsyncStorage.getItem('isOnboarded');
            const onboarded = value === null ? false : JSON.parse(value);
            setState({
                isLoading: false,
                isOnboarded: onboarded,
            });
        } catch(e) {
            Alert.alert("Error", e.message)
        }
        })();
    }, []);

    return (
        <AppContext.Provider value={{ state, setState }}>
        {children}
        </AppContext.Provider>
    );
};