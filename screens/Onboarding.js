import React, { useState, useContext } from 'react';
import { AppContext } from '../AppContext';
import { View, StyleSheet, Image, Text, TextInput, Platform, Keyboard, Pressable, Alert, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = () => {
    const [email, onChangeEmail] = useState('');
    const [name, onChangeName] = useState('');
    const { setState } = useContext(AppContext);

    const finishOnboard = async () => {
        try {
          await AsyncStorage.setItem('isOnboarded', 'true');
          setState((prev) => ({
            ...prev,
            isOnboarded: true
          }));
        } catch (e) {
          Alert.alert("Error", e.message);
        }
      };

    return (
        <View style={onboardingStyles.container}>
            <View style={onboardingStyles.header}>
                <Image style={onboardingStyles.logo} source={require('../assets/Logo.png')}></Image>
            </View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={onboardingStyles.body} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={onboardingStyles.sectionTop}>
                    <Text style={onboardingStyles.bodyText}>Let us get to know you</Text>
                </View>
                <View style={onboardingStyles.sectionBottom}>
                    <Text style={onboardingStyles.bodyText}>First Name</Text>
                    <TextInput style={onboardingStyles.inputBox} value={name} onChangeText={onChangeName} placeholder={'Name'} />
                    <Text style={onboardingStyles.bodyText}>Email</Text>
                    <TextInput style={onboardingStyles.inputBox} value={email} onChangeText={onChangeEmail} placeholder={'Email'} keyboardType={'email-address'} />
                </View> 
            </KeyboardAvoidingView>
            </TouchableWithoutFeedback> 
            <View style={onboardingStyles.footer}>
            <Pressable style={onboardingStyles.button} onPress={finishOnboard}>
                <Text style={onboardingStyles.buttonText}>Next</Text>
            </Pressable>
            </View>
        </View>
    );
};

export default Onboarding;

const onboardingStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EDEFEE',
        flex: 1
    },
    logo: {
        resizeMode: 'contain'
    },
    body: {
        alignItems: 'center',
        backgroundColor: '#495E57',
        flex: 3
    },
    sectionTop: {
        flex: 1,
        justifyContent: 'center'
    },
    sectionBottom: {
        flex: 2,
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bodyText: {
        fontFamily: 'MarkaziText-Regular',
        color: '#F4CE14',
        fontSize: 32
    },
    inputBox: {
        height: 40,
        width: '100%',
        padding: 10,
        margin: 10,
        fontSize: 20,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: 'black',
        backgroundColor: 'white'
    },
    footer: {
        flex: 1,
        paddingRight: 30,
        paddingTop: 50,
        alignItems: 'flex-end',
        justifyContent: 'flex-start'
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        backgroundColor: '#495E57',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: 'MarkaziText-Regular',
        color: '#F4CE14',
        fontSize: 32
    }
})