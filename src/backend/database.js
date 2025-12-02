/**
 * database.js
 * LocalStorage database abstraction layer.
 *
 * @module database
 * @description Provides a class-based interface for localStorage operations.
 * Handles JSON serialization/deserialization and provides CRUD operations
 * with consistent error handling.
 *
 * Note: localStorage is synchronous and has a ~5MB limit per origin.
 * All values are stored as strings. Complex objects must be JSON-serialized
 * before storage and parsed after retrieval.
 *
 * This class implements the following persistence operations:
 * - create: Store new key-value pairs
 * - get: Retrieve values by key
 * - update: Modify existing values (delegates to create)
 * - delete: Remove key-value pairs
 * - countItems: Get total number of stored items
 * - destroy: Clear all stored data
 *
 * @example
 * import Database from './database';
 * const db = new Database();
 * 
 * db.create('user', 'John');
 * console.log(db.get('user')); // 'John'
 * db.delete('user');
 */

/**
 * Database class providing localStorage abstraction.
 * @class Database
 */
class Database {
  /**
   * Creates a new Database instance.
   * Initializes method bindings for consistent 'this' context.
   * @constructor
   */
  constructor() {
    // Application namespace identifier (reserved for future namespacing)
    this.dbName = "weather-app";

    /**
     * Stores a key-value pair in localStorage.
     * Validates that both key and value are defined before storing.
     * 
     * @param {string} key - The storage key identifier
     * @param {*} value - The value to store (stored as-is, caller must stringify objects)
     * @returns {void}
     * @throws {Error} Throws "Database key and value must be declared" if key or value is undefined
     * 
     * @example
     * db.create('USERNAME', 'John');
     * db.create('SETTINGS', JSON.stringify({ theme: 'dark' }));
     */
    this.create = (key, value) => {
      if (key === undefined || value === undefined) {
        throw new Error("Database key and value must be declared");
      }
      localStorage.setItem(key, value);
    };

    /**
     * Removes a key from localStorage.
     * Validates that the key is defined before removal.
     * 
     * @param {string} key - The storage key to remove
     * @returns {void}
     * @throws {Error} Throws "Database key and value must be declared" if key is undefined
     * 
     * @example
     * db.delete('USERNAME');
     */
    this.delete = (key) => {
      if (key === undefined) {
        throw new Error("Database key and value must be declared");
      }
      localStorage.removeItem(key);
    };

    /**
     * Updates an existing key's value in localStorage.
     * Delegates to create() method - behavior is identical (upsert pattern).
     * 
     * @param {string} key - The storage key to update
     * @param {*} value - The new value to store
     * @returns {void}
     * @throws {Error} Throws "Database key and value must be declared" if key or value is undefined
     * 
     * @example
     * db.update('USERNAME', 'Jane');
     */
    this.update = (key, value) => {
      this.create(key, value);
    };

    /**
     * Retrieves a value from localStorage.
     * 
     * @param {string} key - The storage key to retrieve
     * @returns {string|null} The stored value as a string, or null if key doesn't exist
     * 
     * @example
     * const username = db.get('USERNAME'); // 'John' or null
     * const settings = JSON.parse(db.get('SETTINGS') || '{}');
     */
    this.get = key => {
      return localStorage.getItem(key);
    };

    /**
     * Returns the count of items in localStorage.
     * Note: This counts ALL items in localStorage, not just those
     * created by this application.
     * 
     * @returns {number} Number of key-value pairs in localStorage
     * 
     * @example
     * console.log(`Stored items: ${db.countItems()}`);
     */
    this.countItems = () => {
      return localStorage.length;
    };

    /**
     * Clears all items from localStorage.
     * WARNING: This removes ALL application data including settings,
     * cached weather data, and user preferences. This action cannot be undone.
     * 
     * @returns {void}
     * 
     * @example
     * // Reset application to factory defaults
     * db.destroy();
     */
    this.destroy = () => {
      localStorage.clear();
    };
  }
}


export default Database;
