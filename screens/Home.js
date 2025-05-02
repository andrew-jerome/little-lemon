import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, Image, FlatList } from 'react-native'
import { createTable, getMenuItems, saveMenuItems } from '../database';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

// render each item from the menu
const Item = ({ name, price, description }) => (
    <View style={homeStyles.item}>
        <Text style={homeStyles.itemTitle}>{name}</Text>
        <Text style={homeStyles.itemBody}>{description}</Text>
        <Text style={homeStyles.itemPrice}>${price}</Text>
    </View>
);

const Home = () => {
    const [data, setData] = useState([]);

    // fetch the data from the API URL
    const fetchData = async() => {
        let menu = [];
        try {
            const response = await fetch(API_URL);
            const json = await response.json();
            menu = json.menu
        } catch (error) {
            console.log(error);
        }
        return menu;
      }

    // get the data for menuItems, either from the API (if nothing yet stored) or from the SQLite database
    useEffect(() => {
        (async () => {
            try {
                await createTable();
                let menuItems = await getMenuItems();
    
                if (!menuItems.length) {
                    menuItems = await fetchData();
                    console.log("test")
                    saveMenuItems(menuItems);
                }
                setData(menuItems);
            } catch (e) {
                Alert.alert(e.message);
            }
        })();
    }, []);

    return (
        <View>
            <View style={homeStyles.infoSection}>
                <Text style={homeStyles.infoHeader}>Little Lemon</Text>
                <View style={homeStyles.infoRow}>
                    <View style={homeStyles.infoText}>
                        <Text style={homeStyles.infoSubheader}>Chicago</Text>
                        <Text style = {homeStyles.infoBody}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                    </View>
                    <Image style={homeStyles.infoImage} source={require('../assets/Hero image.png')}></Image>                
                </View>
            </View>
            <FlatList
                style={homeStyles.flatList}
                data={data}
                renderItem={({ item }) => (
                    <Item name={item.name} price={item.price} description={item.description} />
                )}
                ItemSeparatorComponent={() => (
                    <View style={homeStyles.itemSeparator}/>
                )}
             />
        </View>
    )
}

export default Home;

const homeStyles = StyleSheet.create({
    infoSection: {
        padding: 15,
        backgroundColor: '#495E57'
    },
    infoHeader: {
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'MarkaziText-Regular',
        color: '#F4CE14'
    },
    infoSubheader: {
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'MarkaziText-Regular',
        color: '#EDEFEE'
    },
    infoBody: {
        paddingVertical: 20,
        fontSize: 20,
        fontFamily: 'Karla-Regular',
        color: '#EDEFEE'
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoText: {
        flexDirection: 'column',
        flex: 2
    },
    infoImage: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 10,
        resizeMode: 'cover'
    },
    flatList: {
        paddingHorizontal: 15
    },
    itemSeparator: {
        height: 1,
        backgroundColor: '#495E57',
    },
    item: {
        paddingVertical: 15
    },
    itemTitle: {
        fontFamily: 'MarkaziText-Regular',
        fontWeight: 'bold',
        color: '#333333',
        fontSize: 20,
        marginBottom: 5
    },
    itemBody: {
        fontFamily: 'Karla-Regular',
        fontSize: 16,
        color: '#495E57',
        marginBottom: 5
    },
    itemPrice: {
        fontFamily: 'MarkaziText-Regular',
        fontSize: 16,
        color: '#495E57',
        fontWeight: 'bold',

    }
})