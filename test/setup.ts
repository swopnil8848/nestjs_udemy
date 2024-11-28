import { error } from 'console';
import { rm } from 'fs/promises';
import { join } from 'path';
import { createConnection, getConnection } from 'typeorm';
import { User } from '../src/users/user.entity';
import { Report } from '../src/reports/report.entity';

// Before each test: Delete the SQLite database file
global.beforeEach(async () => {
  try {
    // Delete the test database file
    await rm(join(__dirname, '..', 'test.sqlite'));
    console.log('test.sqlite successfully deleted.');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error deleting test.sqlite:', err);
    }
  }
});


// After each test: Close connections
global.afterEach(async () => {
  try {
    const conn = getConnection();
    console.log("connection.isConnected",conn)
    // if (conn.isConnected) {
    await conn.close();
    // }
  } catch (err) {
    console.error('Error closing database connection:', err);
  }
});