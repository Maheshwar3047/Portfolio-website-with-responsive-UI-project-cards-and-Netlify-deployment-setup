import { Handler } from '@netlify/functions';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'demo_website_db',
  connectTimeout: 10000
};

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testConnection(retries = 3, delayMs = 2000) {
  console.log('Database connection configuration:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: 3306
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Connection attempt ${attempt}/${retries}`);
      
      const connection = await mysql.createConnection(dbConfig);
      console.log('Successfully connected to database');
      
      const [rows] = await connection.execute('SELECT 1 as test');
      console.log('Test query successful:', rows);
      
      await connection.end();
      console.log('Connection closed successfully');
      
      return true;
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, {
        message: error.message,
        code: error.code,
        errno: error.errno
      });

      if (error.code === 'ECONNREFUSED') {
        console.error('Please ensure that:');
        console.error('1. MySQL server is installed and running');
        console.error('2. MySQL is accepting connections on port 3306');
        console.error('3. Firewall settings allow the connection');
      } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('Authentication failed. Please check:');
        console.error('1. Username is correct');
        console.error('2. Password is correct');
      } else if (error.code === 'ER_BAD_DB_ERROR') {
        console.error('Database does not exist. Please run the setup script first.');
      }

      if (attempt < retries) {
        console.log(`Waiting ${delayMs}ms before next attempt...`);
        await delay(delayMs);
      }
    }
  }

  return false;
}

if (require.main === module) {
  testConnection()
    .then(success => {
      if (!success) {
        console.error('All connection attempts failed');
        process.exit(1);
      }
      console.log('Connection test completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

export const handler: Handler = async () => {
  const success = await testConnection();
  
  return {
    statusCode: success ? 200 : 500,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success,
      message: success ? 'Database connection successful' : 'Database connection failed'
    })
  };
};