import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { UserContext } from "../contexts/UserContext";
import { View, StyleSheet, Image, Text, TextInput, Platform, Keyboard, Pressable, Alert, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail, validateName, validatePersonalInfo } from '../utils/validation';

const Onboarding = () => {
    const [nameTouched, setNameTouched] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const { personalInfo, setPersonalInfo} = useContext(UserContext)
    const { setState } = useContext(AppContext);

    const finishOnboard = async () => {
        try {
            await AsyncStorage.setItem('personalInfo', JSON.stringify(personalInfo))
            await AsyncStorage.setItem('isOnboarded', 'true');
            setState((prev) => ({
                ...prev,
                isOnboarded: true
            }));
        } catch (e) {
            Alert.alert("Error", e.message);
        }
    };
    
    const updateState = (key) => (value) =>
        setPersonalInfo((prevState) => ({
            ...prevState,
            [key]: value
        }));

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
                    <TextInput style={onboardingStyles.inputBox} value={personalInfo.firstName} onChangeText={updateState('firstName')} placeholder={'Name'} onBlur={() => setNameTouched(true)} />
                    {nameTouched && !validateName(personalInfo.firstName) && (
                        <Text style={onboardingStyles.warning}>*Please enter a valid name (only letters A-Z)</Text>
                    )}
                    <Text style={onboardingStyles.bodyText}>Email</Text>
                    <TextInput style={onboardingStyles.inputBox} value={personalInfo.email} onChangeText={updateState('email')} placeholder={'Email'} keyboardType={'email-address'} onBlur={() => setEmailTouched(true)}/>
                    {emailTouched && !validateEmail(personalInfo.email) && (
                        <Text style={onboardingStyles.warning}>*Please enter a valid email address</Text>
                    )}
                </View> 
            </KeyboardAvoidingView>
            </TouchableWithoutFeedback> 
            <View style={onboardingStyles.footer}>
            <Pressable style={!validatePersonalInfo(personalInfo) ? onboardingStyles.buttonDisabled : onboardingStyles.buttonEnabled} onPress={finishOnboard} disabled={!validatePersonalInfo(personalInfo)}>
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
        width: '90%',
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
        width: '80%',
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
    buttonEnabled: {
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
    },
    buttonDisabled: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        backgroundColor: '#767577',
        alignItems: 'center'
    },
    warning: {
        fontFamily: 'MarkaziText-Regular',
        color: '#F4CE14',
        fontSize: 16
    }
})