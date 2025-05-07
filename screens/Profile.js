import React, { useState, useContext, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import { AppContext } from '../contexts/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TextInput, Switch, Pressable, Image, Alert, ScrollView } from "react-native";
import { UserContext } from "../contexts/UserContext";
import { validateEmail, validateName, validatePhone, validatePersonalInfo } from '../utils/validation';

const Profile = () => {
    const [nameTouched, setNameTouched] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [numberTouched, setNumberTouched] = useState(false);
    const { personalInfo, setPersonalInfo} = useContext(UserContext);
    const { setState } = useContext(AppContext);

    const pickAvatar = async() => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) {
            alert("Permission to access media library is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPersonalInfo((prev) => ({
                ...prev,
                avatar: result.assets[0].uri
            }))
        }
    };

    const removeAvatar = () => {
        Alert.alert(
            "Remove Image",
            "Are you sure you want to remove your profile picture?",
            [
                {
                    text: "Cancel"
                },
                {
                    text: "OK",
                    onPress: () => setPersonalInfo((prev) => ({
                        ...prev,
                        avatar: null
                    }))
                }
            ]
        );
    };

    const logOut = async () => {
        try {
          await AsyncStorage.setItem('isOnboarded', 'false');
          setState((prev) => ({
            ...prev,
            isOnboarded: false
          }));
        } catch (e) {
          Alert.alert("Error", e.message);
        }
    };

    const storePersonalInfo = async () => {
        try {
            await AsyncStorage.setItem('personalInfo', JSON.stringify(personalInfo))
        } catch (e) {
            Alert.alert("Error", e.message);
        }
    }

    const updateState = (key) => (value) =>
        setPersonalInfo((prevState) => ({
            ...prevState,
            [key]: value
        }));

    const toggleState = (key) => () =>
        setPersonalInfo((prevState) => ({
            ...prevState,
            [key]: !prevState[key]
        }));

    const resetState = async () => {
        setPersonalInfo(() => ({
            firstName: '',
            lastName: '',
            email: '',
            number: '',
            isOrderStatus: false,
            isSpecialOffers: false,
            isNewsletter: false,
            avatar: null
        }))
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
    }
    
    return (
        <ScrollView style={profileStyles.container} keyboardDismissMode="on-drag">
            <Text style={profileStyles.headerText}>Personal Information</Text>
            <Text style={profileStyles.bodyText}>Avatar</Text>
            <View style={profileStyles.avatarContainer}>
                {personalInfo.avatar ? (
                    <Image source={{ uri: personalInfo.avatar }} style={profileStyles.avatar}/>
                ) : (
                    <View style={profileStyles.avatar}>
                        <Text style={profileStyles.placeholderText}>{(personalInfo.firstName[0] || '').toUpperCase()}{(personalInfo.lastName[0] || '').toUpperCase()}</Text>
                    </View>
                )}
                <Pressable style={profileStyles.editButtonEnabled} onPress={pickAvatar}>
                    <Text style={profileStyles.editButtonText}>Change</Text>
                </Pressable>
                <Pressable style={profileStyles.removeButton} onPress={removeAvatar}>
                    <Text style={profileStyles.removeButtonText}>Remove</Text>
                </Pressable>
            </View>
            <Text style={profileStyles.bodyText}>First Name</Text>
            {nameTouched && !validateName(personalInfo.firstName) && (
                <Text style={profileStyles.warning}>*Must be a valid name (only letters A-Z)</Text>
            )}
            <TextInput style={profileStyles.inputBox} value={personalInfo.firstName} onChangeText={updateState('firstName')} placeholder={'First Name'} onBlur={() => setNameTouched(true)}/>
            <Text style={profileStyles.bodyText}>Last Name</Text>
            <TextInput style={profileStyles.inputBox} value={personalInfo.lastName} onChangeText={updateState('lastName')} placeholder={'Last Name'} />
            <Text style={profileStyles.bodyText}>Email</Text>
            {emailTouched && !validateEmail(personalInfo.email) && (
                <Text style={profileStyles.warning}>*Must be a valid email</Text>
            )}
            <TextInput style={profileStyles.inputBox} value={personalInfo.email} onChangeText={updateState('email')} placeholder={'Email'} keyboardType='email-address' onBlur={() => setEmailTouched(true)}/>
            <Text style={profileStyles.bodyText}>Phone Number</Text>
            {numberTouched && !validatePhone(personalInfo.number) && (
                <Text style={profileStyles.warning}>*Must be a valid phone number</Text>
            )}
            <TextInput style={profileStyles.inputBox} value={personalInfo.number} onChangeText={updateState('number')} placeholder={'Phone Number'} keyboardType='phone-pad' onBlur={() => setNumberTouched(true)}/>
            <Text style={profileStyles.headerText}>Email Notifications</Text>
            <View style={profileStyles.switchContainer}>
                <Switch 
                    trackColor={{false: '#767577', true: '#495E57'}} 
                    thumbColor={personalInfo.isOrderStatus ? '#F4CE14' : '#f4f3f4'}
                    onValueChange={toggleState('isOrderStatus')}
                    value={personalInfo.isOrderStatus}
                    style={profileStyles.switch}/>
                <Text style={profileStyles.bodyText}>Order status</Text>    
            </View>
            <View style={profileStyles.switchContainer}>
                <Switch 
                    trackColor={{false: '#767577', true: '#495E57'}} 
                    thumbColor={personalInfo.isSpecialOffers ? '#F4CE14' : '#f4f3f4'}
                    onValueChange={toggleState("isSpecialOffers")}
                    value={personalInfo.isSpecialOffers}
                    style={profileStyles.switch}/>
                <Text style={profileStyles.bodyText}>Special Offers</Text>    
            </View>
            <View style={profileStyles.switchContainer}>
                <Switch 
                    trackColor={{false: '#767577', true: '#495E57'}} 
                    thumbColor={personalInfo.isNewsletter ? '#F4CE14' : '#f4f3f4'}
                    onValueChange={toggleState('isNewsletter')}
                    value={personalInfo.isNewsletter}
                    style={profileStyles.switch}/>
                <Text style={profileStyles.bodyText}>Newsletter</Text>    
            </View>
            <View style={profileStyles.rowContainer}>
                <Pressable style={profileStyles.removeButton} onPress={resetState}>
                    <Text style={profileStyles.removeButtonText}>Discard</Text>
                </Pressable>
                <Pressable style={!validatePersonalInfo(personalInfo) ? profileStyles.editButtonDisabled : profileStyles.editButtonEnabled} onPress={storePersonalInfo} disabled={!validatePersonalInfo(personalInfo)}>
                    <Text style={profileStyles.editButtonText}>Save Changes</Text>
                </Pressable>
            </View>
            <Pressable style={profileStyles.logout} onPress={logOut} >
                <Text style={profileStyles.logoutText}>Log out</Text>
            </Pressable>
        </ScrollView>    
    )
}

export default Profile;

const profileStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginVertical: 15
    },
    bodyText: {
        fontSize: 18,
        fontFamily: 'Karla-Regular',
        color: '#333333'
    },
    warning: {
        fontSize: 18,
        fontFamily: 'Karla-Regular',
        color: '#495E57'
    },
    avatarContainer: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    placeholderText: {
        fontSize: 32,
        color: 'white',
        fontWeight: 'bold'
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#767577',
        justifyContent: 'center',
        alignItems: 'center'
    },
    editButtonEnabled: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 15,
        backgroundColor: '#495E57',
        alignItems: 'center'
    },
    editButtonDisabled: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 15,
        backgroundColor: '#767577',
        alignItems: 'center'
    },
    editButtonText: {
        color: '#EDEFEE',
        fontSize: 24,
        fontFamily: 'MarkaziText-Regular',
    },
    removeButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 10,
        marginVertical: 15,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    removeButtonText: {
        color: '#333333',
        fontSize: 24,
        fontFamily: 'MarkaziText-Regular',
    },
    inputBox: {
        height: 40,
        width: '100%',
        padding: 10,
        marginTop: 5,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#333333',
        backgroundColor: 'white'
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    switch: {
        marginRight: 10
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        justifyContent: 'space-around'
    },
    logout: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 80,
        backgroundColor: '#F4CE14',
        alignItems: 'center'
    },
    logoutText: {
        fontSize: 24,
        fontFamily: 'MarkaziText-Regular',
        color: '#333333',
    }
})
