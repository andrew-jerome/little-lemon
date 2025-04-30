import React, { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, Text, View, TextInput, Switch, Pressable, Image, Alert, ScrollView } from "react-native";

const Profile = () => {
    const [avatar, setAvatar] = useState(null);
    const [firstName, onChangeFirstName] = useState('');
    const [lastName, onChangeLastName] = useState('');
    const [email, onChangeEmail] = useState('');
    const [number, onChangeNumber] = useState('');
    const [isOrderStatus, setOrderStatus] = useState(false);
    const [isSpecialOffers, setSpecialOffers] = useState(false);
    const [isNewsletter, setNewsletter] = useState(false);

    const toggleOrderStatus = () => setOrderStatus(previousState => !previousState)
    const toggleSpecialOffers = () => setSpecialOffers(previousState => !previousState)
    const toggleNewsletter = () => setNewsletter(previousState => !previousState)

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

        console.log(result)

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
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
                    onPress: () => setAvatar(null)
                }
            ]
        );
    };
    
    return (
        <ScrollView style={profileStyles.container} keyboardDismissMode="on-drag">
            <Text style={profileStyles.headerText}>Personal Information</Text>
            <Text style={profileStyles.bodyText}>Avatar</Text>
            <View style={profileStyles.avatarContainer}>
                {avatar ? (
                    <Image source={{ uri: avatar }} style={profileStyles.avatar}/>
                ) : (
                    <View style={profileStyles.avatar}>
                        <Text style={profileStyles.placeholderText}>{(firstName[0] || '').toUpperCase()}{(lastName[0] || '').toUpperCase()}</Text>
                    </View>
                )}
                <Pressable style={profileStyles.editButton} onPress={pickAvatar}>
                    <Text style={profileStyles.editButtonText}>Change</Text>
                </Pressable>
                <Pressable style={profileStyles.removeButton} onPress={removeAvatar}>
                    <Text style={profileStyles.removeButtonText}>Remove</Text>
                </Pressable>
            </View>
            <Text style={profileStyles.bodyText}>First Name</Text>
            <TextInput style={profileStyles.inputBox} value={firstName} onChangeText={onChangeFirstName} placeholder={'First Name'} />
            <Text style={profileStyles.bodyText}>Last Name</Text>
            <TextInput style={profileStyles.inputBox} value={lastName} onChangeText={onChangeLastName} placeholder={'Last Name'} />
            <Text style={profileStyles.bodyText}>Email</Text>
            <TextInput style={profileStyles.inputBox} value={email} onChangeText={onChangeEmail} placeholder={'Email'} />
            <Text style={profileStyles.bodyText}>Phone Number</Text>
            <TextInput style={profileStyles.inputBox} value={number} onChangeText={onChangeNumber} placeholder={'Phone Number'} />
            <Text style={profileStyles.headerText}>Email Notifications</Text>
            <View style={profileStyles.switchContainer}>
                <Switch 
                    trackColor={{false: '#767577', true: '#495E57'}} 
                    thumbColor={isOrderStatus ? '#F4CE14' : '#f4f3f4'}
                    onValueChange={toggleOrderStatus}
                    value={isOrderStatus}
                    style={profileStyles.switch}/>
                <Text style={profileStyles.bodyText}>Order status</Text>    
            </View>
            <View style={profileStyles.switchContainer}>
                <Switch 
                    trackColor={{false: '#767577', true: '#495E57'}} 
                    thumbColor={isSpecialOffers ? '#F4CE14' : '#f4f3f4'}
                    onValueChange={toggleSpecialOffers}
                    value={isSpecialOffers}
                    style={profileStyles.switch}/>
                <Text style={profileStyles.bodyText}>Special Offers</Text>    
            </View>
            <View style={profileStyles.switchContainer}>
                <Switch 
                    trackColor={{false: '#767577', true: '#495E57'}} 
                    thumbColor={isNewsletter ? '#F4CE14' : '#f4f3f4'}
                    onValueChange={toggleNewsletter}
                    value={isNewsletter}
                    style={profileStyles.switch}/>
                <Text style={profileStyles.bodyText}>Newsletter</Text>    
            </View>
            <View style={profileStyles.rowContainer}>
                <Pressable style={profileStyles.removeButton}>
                    <Text style={profileStyles.removeButtonText}>Discard</Text>
                </Pressable>
                <Pressable style={profileStyles.editButton}>
                    <Text style={profileStyles.editButtonText}>Save Changes</Text>
                </Pressable>
            </View>
            <Pressable style={profileStyles.logout}>
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
        fontSize: 24,
        fontFamily: 'MarkaziText-Regular',
        fontWeight: 'bold',
        color: '#333333',
        marginVertical: 15
    },
    bodyText: {
        fontSize: 16,
        fontFamily: 'Karla-Regular',
        color: '#333333'
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
    editButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 15,
        backgroundColor: '#495E57',
        alignItems: 'center'
    },
    editButtonText: {
        color: '#EDEFEE',
        fontSize: 16,
        fontFamily: 'MarkaziText-Regular',
        fontWeight: 'bold',
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
        fontSize: 16,
        fontFamily: 'MarkaziText-Regular',
        fontWeight: 'bold',
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
        fontSize: 16,
        fontFamily: 'MarkaziText-Regular',
        fontWeight: 'bold',
        color: '#333333',
    }
})
