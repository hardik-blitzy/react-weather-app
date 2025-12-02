/**
 * app_backend.js
 * Application database singleton instance.
 *
 * @module app_backend
 * @description Exports a single Database instance for use throughout
 * the application. This singleton pattern ensures consistent state
 * and prevents multiple Database instances.
 *
 * The singleton is instantiated at module evaluation time, meaning
 * the Database constructor runs as soon as this module is imported.
 * All modules that import 'db' receive the same shared instance.
 *
 * @example
 * import { db } from './backend/app_backend';
 * 
 * // Create/Update a value
 * db.create('USER_NAME', 'John');
 * 
 * // Read a value
 * const name = db.get('USER_NAME');
 * 
 * // Delete a value
 * db.delete('USER_NAME');
 * 
 * @see ./database.js - The Database class implementation
 */

import Database from "./database";

// Singleton instance - instantiated once when module is first imported
// All importers share this same Database instance
export let db = new Database();
