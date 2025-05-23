import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('little_lemon');

// create a new SQLite database with a table for menu items
export async function createTable() {
    (await db).execAsync('create table if not exists menuitems (id integer primary key autoincrement, name text, price text, description text, image text, category text);');
}

// return every item from the table menu items
export async function getMenuItems() {
    const data = (await db).getAllAsync('select * from menuitems');
    return data;
}

// save all items of the array menuItems into the database table menu items
export async function saveMenuItems(menuItems) {
    const dbInstance = await db;

    const insertPromises = menuItems.map((item) => {
        return dbInstance.runAsync(`insert into menuitems (name, price, description, image, category) values (?, ?, ?, ?, ?)`,
            [item.name, item.price, item.description, item.image, item.category]
        )
    });

    await Promise.all(insertPromises);
}

// return data filtered through the query and the active categories
export async function filterByCategories(query, activeCategories) {
    const dbInstance = await db;
    const lowerCategories = activeCategories.map(cat => cat.toLowerCase());
    const lowerQuery = `%${query.toLowerCase()}%`;
    const placeholders = lowerCategories.map(() => '?').join(', ');
    const params = [...lowerCategories, lowerQuery]

    try {
        const data = dbInstance.getAllAsync(`select * from menuitems where category in (${placeholders}) and lower(name) like ?`, params);
        return data;
    } catch (e) {
        console.log('Error fetching data: ', e);
    }
}