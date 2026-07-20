import sqlite3 from 'sqlite3';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';
import { encryptData, decryptData } from './crypto.js';
const dbPath = path.join(app.getPath('userData'), 'zcore-data.sqlite');
console.log('Database path:', dbPath);
// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}
// Initialize SQLite Database
export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    }
    else {
        console.log('Connected to local SQLite database.');
        initDb();
    }
});
function initDb() {
    db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      storeId TEXT,
      orderDate INTEGER,
      encryptedData TEXT
    )
  `, (err) => {
        if (err) {
            console.error('Error creating orders table:', err.message);
        }
        else {
            console.log('Orders table ready.');
            // Performans için orderDate üzerine Index ekliyoruz
            db.run(`CREATE INDEX IF NOT EXISTS idx_order_date ON orders(orderDate)`);
        }
    });
}
/**
 * Adds an order securely by encrypting its sensitive payload.
 */
export function addOrder(order, keySeed) {
    return new Promise((resolve, reject) => {
        try {
            const { id, storeId, orderDate, ...sensitiveData } = order;
            const encryptedData = encryptData(sensitiveData, keySeed);
            db.run(`INSERT OR REPLACE INTO orders (id, storeId, orderDate, encryptedData) VALUES (?, ?, ?, ?)`, [id, storeId, orderDate, encryptedData], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
/**
 * Retrieves orders from the last N days and decrypts them.
 */
export function getOrders(days = 30, keySeed) {
    return new Promise((resolve, reject) => {
        const thirtyDaysAgo = Date.now() - (days * 24 * 60 * 60 * 1000);
        db.all(`SELECT * FROM orders WHERE orderDate >= ? ORDER BY orderDate DESC`, [thirtyDaysAgo], (err, rows) => {
            if (err) {
                return reject(err);
            }
            const decryptedOrders = rows.map(row => {
                const sensitiveData = decryptData(row.encryptedData, keySeed);
                if (!sensitiveData) {
                    // Decryption failed (wrong key or corrupted)
                    return {
                        id: row.id,
                        storeId: row.storeId,
                        orderDate: row.orderDate,
                        error: 'DECRYPTION_FAILED'
                    };
                }
                return {
                    id: row.id,
                    storeId: row.storeId,
                    orderDate: row.orderDate,
                    ...sensitiveData
                };
            });
            resolve(decryptedOrders);
        });
    });
}
