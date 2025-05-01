import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
    const [personalInfo, setPersonalInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        number: '',
        isOrderStatus: false,
        isSpecialOffers: false,
        isNewsletter: false,
        avatar: null
    });

    useEffect(() => {
        (async () => {
          try {
            const jsonValue = await AsyncStorage.getItem('personalInfo');
            const value = jsonValue != null ? JSON.parse(jsonValue) : {};

            setPersonalInfo((prev) => ({
                ...prev,
                ...value
            }))
          } catch (e) {
            Alert.alert(`An error occurred: ${e.message}`);
          }
        })();
      }, []);

    return (
        <UserContext.Provider value={{ personalInfo, setPersonalInfo }}>
        {children}
        </UserContext.Provider>
    );
};