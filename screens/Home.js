import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, Image, FlatList, Button, Pressable } from 'react-native'
import { createTable, getMenuItems, saveMenuItems, filterByCategories } from '../database';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUpdateEffect } from '../utils/effects';
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
                <Text style={homeStyles.itemPrice}>${price}</Text>
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
    // async function downloadImage(imageName, retries = 2) {
    //     const fileURI = FileSystem.documentDirectory + imageName;
    //     const URL = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageName}?raw=true`;
      
    //     try {
    //       const download = await FileSystem.downloadAsync(URL, fileURI);
      
    //       const fileInfo = await FileSystem.getInfoAsync(download.uri);
    //       if (!fileInfo.exists || fileInfo.size === 0) {
    //         throw new Error('Downloaded file is empty or missing.');
    //       }
      
    //       console.log(`✅ Image downloaded: ${imageName}`);
    //       return download.uri;
    //     } catch (err) {
    //       console.warn(`❌ Failed to download ${imageName}: ${err.message}`);
      
    //       if (retries > 0) {
    //         console.log(`🔁 Retrying download for ${imageName}...`);
    //         return await downloadImage(imageName, retries - 1);
    //       }
      
    //       return null;
    //     }
    //   }

    // get the data for menuItems, either from the API (if nothing yet stored) or from the SQLite database
    useEffect(() => {
        (async () => {
            try {
                await createTable();
                let menuItems = await getMenuItems();
    
                if (!menuItems.length) {
                    menuItems = await fetchData();
                    menuItems = await Promise.all(
                        menuItems.map(async (item) => {
                        localImageURI = await downloadImage(item.image)
                        return {
                            ...item,
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
            // If all filters are deselected, all categories are active
            if (filterSelections.every((item) => item === false)) {
              return true;
            }
            return filterSelections[i];
          });
          try {
            const menuItems = await filterByCategories(activeCategories);
            setData(menuItems);
          } catch (e) {
            Alert.alert(e.message);
          }
        })();
    }, [filterSelections]);

    // update filter selections
    const handleFiltersChange = async (index) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !filterSelections[index];
        setFilterSelections(arrayCopy);
    };

    return (
        <View style={homeStyles.container}>
            {/* <Button title="Reset Data" onPress={resetAppStorage} /> */}
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
                    showsHorizontalScrollIndicator={false}/>
                <View style={homeStyles.itemSeparator}/>
            </View>
            <FlatList
                style={homeStyles.menuList}
                data={data}
                keyExtractor={(item) => item.id}
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
        fontFamily: 'MarkaziText-Regular',
        fontWeight: 'bold',
        color: '#333333',
        fontSize: 20,
    },
    itemBody: {
        fontFamily: 'Karla-Regular',
        fontSize: 18,
        color: '#495E57',
    },
    itemPrice: {
        fontFamily: 'MarkaziText-Regular',
        fontSize: 18,
        color: '#495E57',
        fontWeight: 'bold',
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
        fontFamily: 'MarkaziText-Regular',
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
        fontFamily: 'MarkaziText-Regular',
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
        fontFamily: 'MarkaziText-Regular',
        fontSize: 18,
        color: '#F4CE14',
        fontWeight: 'bold'
    }
})