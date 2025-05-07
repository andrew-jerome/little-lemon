import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { Text, View, StyleSheet, Image, FlatList, Button, Pressable } from 'react-native'
import { createTable, getMenuItems, saveMenuItems, filterByCategories } from '../database';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUpdateEffect } from '../utils/effects';
import { Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['Starters', 'Mains', 'Desserts', 'Drinks', 'Specials']

// render each item from the menu
const Item = ({ name, price, description, image }) => (
    <View style={homeStyles.item}>
        <Text style={homeStyles.itemTitle}>{name}</Text>
        <View style={homeStyles.itemRow}>
            <View style={homeStyles.itemInfo}>
                <Text style={homeStyles.itemBody} numberOfLines={2}>{description}</Text>
                <Text style={homeStyles.itemBody}>${price}</Text>
            </View> 
            <View style={homeStyles.imageWrapper}>
                <Image style={homeStyles.itemImage} source={{ uri: image }} onError={(e) => console.warn(`🛑 Image failed to load: ${image}`, e.nativeEvent.error)}/>
            </View>
        </View>
    </View>
);

// render each Filter
const Filter = ({ name, selections, index, onChange }) => (
    <Pressable style={selections[index] ? homeStyles.filterContainerActive : homeStyles.filterContainerInactive} onPress={() => onChange(index)}>
        <Text style={selections[index] ? homeStyles.filterTextActive : homeStyles.filterTextInactive}>{name}</Text>
    </Pressable>    
);

const Home = () => {
    const [data, setData] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
    const [filterSelections, setFilterSelections] = useState(sections.map(() => false));

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

    // deletes data in app for testing purposes
    async function resetAppStorage() {
        try {
          // 1. Clear AsyncStorage
          await AsyncStorage.clear();
          console.log('AsyncStorage cleared.');
      
          // 2. Delete SQLite database
          const dbPath = `${FileSystem.documentDirectory}SQLite/little_lemon`;
          const dbInfo = await FileSystem.getInfoAsync(dbPath);
      
          if (dbInfo.exists) {
            await FileSystem.deleteAsync(dbPath, { idempotent: true });
            console.log('SQLite database deleted.');
          } else {
            console.log('SQLite database not found.');
          }
      
          console.log('App reset complete.');
        } catch (error) {
          console.error('Error during app reset:', error);
        }
      }

    // store the image for a menu item for offline use
    async function downloadImage(imageName) {
        if (imageName == 'lemonDessert.jpg') {
            imageName = 'lemonDessert 2.jpg'
        }
        const fileURI = FileSystem.documentDirectory + imageName
        const URL = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageName}?raw=true`

        const download = await FileSystem.downloadAsync(URL, fileURI);

        return download.uri;
    }

    // get the data for menuItems, either from the API (if nothing yet stored) or from the SQLite database
    useEffect(() => {
        (async () => {
            try {
                await createTable();
                let menuItems = await getMenuItems();
    
                if (!menuItems.length) {
                    menuItems = await fetchData();
                    menuItems = await Promise.all(
                        menuItems.map(async (item, index) => {
                        localImageURI = await downloadImage(item.image)
                        return {
                            ...item,
                            tempId: index,
                            image: localImageURI
                        }
                    }))
                    saveMenuItems(menuItems);
                }
                setData(menuItems);
            } catch (e) {
                Alert.alert(e.message);
            }
        })();
    }, []);

    // update the data based on queries and filtering
    useUpdateEffect(() => {
        (async () => {
          const activeCategories = sections.filter((s, i) => {
            if (filterSelections.every((item) => item === false)) {
              return true;
            }
            return filterSelections[i];
          });
          try {
            const menuItems = await filterByCategories(query, activeCategories);
            setData(menuItems);
          } catch (e) {
            Alert.alert(e.message);
          }
        })();
    }, [filterSelections, query]);

    // update filter selections
    const handleFiltersChange = async (index) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !filterSelections[index];
        setFilterSelections(arrayCopy);
    };

    const lookup = useCallback((q) => {
        setQuery(q);
      }, []);
    
    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

    const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
    };

    return (
        <View style={homeStyles.container}>
            {/* <Button title="Reset Data" onPress={resetAppStorage} /> */}
            <View style={homeStyles.infoSection}>
                <View style={homeStyles.headerContainer}>
                    <Text style={homeStyles.infoHeader}>Little Lemon</Text>
                </View>  
                <View style={homeStyles.infoRow}>
                    <View style={homeStyles.infoText}>
                        <Text style={homeStyles.infoSubheader}>Chicago</Text>
                        <Text style = {homeStyles.infoBody}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                    </View>
                    <Image style={homeStyles.infoImage} source={require('../assets/Hero image.png')}></Image>                
                </View>
                <Searchbar
                    placeholder="Search"
                    placeholderTextColor="#333333"
                    mode="view"
                    onChangeText={handleSearchChange}
                    value={searchBarText}
                    style={homeStyles.searchBar}
                    iconColor="#333333"
                    inputStyle={homeStyles.searchBarText}
                    shadow={0}
                />
            </View>
            <View>
                <Text style={homeStyles.deliveryHeader}>ORDER FOR DELIVERY!</Text>
                <FlatList
                    style={homeStyles.filterList}
                    horizontal 
                    data={sections}
                    keyExtractor = {(item) => item}
                    renderItem={({ item, index }) => (
                        <Filter name={item} selections={filterSelections} index={index} onChange={handleFiltersChange}/>
                    )}
                    showsHorizontalScrollIndicator={false}
                />
                <View style={homeStyles.itemSeparator}/>
            </View>
            <FlatList
                style={homeStyles.menuList}
                data={data}
                keyExtractor={(item) => item.id || item.tempId}
                renderItem={({ item }) => (
                    <Item name={item.name} price={item.price} description={item.description} image={item.image} />
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
    container: {
        flex: 1,
        width: '100%'
    },
    infoSection: {
        padding: 15,
        backgroundColor: '#495E57'
    },
    headerContainer: {
        height: 46,
    },
    infoHeader: { 
        fontFamily: 'MarkaziText-Regular',
        fontSize: 54,
        color: '#F4CE14'
    },
    infoSubheader: {
        fontSize: 40,
        fontFamily: 'MarkaziText-Regular',
        color: '#EDEFEE'
    },
    infoBody: {
        paddingVertical: 10,
        marginRight: 5,
        fontSize: 18,
        fontFamily: 'Karla-Regular',
        color: '#EDEFEE'
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoText: {
        flexDirection: 'column',
        flex: 3
    },
    infoImage: {
        flex: 2,
        aspectRatio: 1,
        borderRadius: 10,
        resizeMode: 'cover'
    },
    searchBar: {
        backgroundColor: '#EDEFEE',
        shadowRadius: 0,
        shadowOpacity: 0,
    },
    searchBarText: {
        fontFamily: 'Karla-Regular',
        color: '#333333',
        fontSize: 20,
        minHeight: 0
    },  
    menuList: {
        width: '100%',
        marginBottom: 50
    },
    itemSeparator: {
        height: 1,
        backgroundColor: '#495E57',
        marginHorizontal: 15
    },
    item: {
        padding: 15,
        width: '100%'
    },
    itemTitle: {
        fontWeight: 'bold',
        color: '#333333',
        fontSize: 20,
    },
    itemBody: {
        fontFamily: 'Karla-Regular',
        fontSize: 18,
        color: '#495E57',
    },
    itemRow: {
        flexDirection: 'row',
        width: '100%'
    },
    itemInfo: {
        flex: 3,
        justifyContent: 'space-around',
        paddingRight: 15
    },
    imageWrapper: {
        flex: 1
    },
    itemImage: {
        aspectRatio: 1,
        resizeMode: 'cover'
    },
    deliveryHeader: {
        padding: 15,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333'
    },
    filterList: {
        paddingLeft: 15,
        paddingBottom: 15,
    },
    filterContainerInactive: {
        padding: 10,
        backgroundColor: '#767577',
        marginRight: 15,
        borderRadius: 15
    },
    filterTextInactive: {
        fontSize: 18,
        color: '#EDEFEE',
        fontWeight: 'bold'
    },
    filterContainerActive: {
        padding: 10,
        backgroundColor: '#495E57',
        marginRight: 15,
        borderRadius: 15
    },
    filterTextActive: {
        fontSize: 18,
        color: '#F4CE14',
        fontWeight: 'bold'
    }
})