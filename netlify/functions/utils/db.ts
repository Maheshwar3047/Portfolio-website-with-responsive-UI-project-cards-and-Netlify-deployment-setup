import mysql, { Connection, RowDataPacket } from 'mysql2/promise';
import { logger } from './logger';
import { queryCache } from './cache';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_SSL: string;
    }
  }
}

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: true
  } : undefined,
  connectTimeout: 10000,
  pool: {
    min: 2,
    max: 20,
    idle: 10000,
    acquire: 30000
  },
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

let connectionPool: mysql.Pool | null = null;

async function getPool(): Promise<mysql.Pool> {
  if (!connectionPool) {
    connectionPool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      queueLimit: 0
    });

    // Add error handler to the pool
    connectionPool.on('error', (err) => {
      logger.error('Database pool error', err);
      connectionPool = null; // Reset pool on error
    });
  }
  return connectionPool;
}

// Cache keys generator to handle different parameter types
function generateCacheKey(sql: string, params: any[]): string {
  return `${sql}-${JSON.stringify(params)}`;
}

export async function query<T extends RowDataPacket[]>(
  sql: string, 
  params: any[] = [], 
  options: { 
    cache?: boolean; 
    ttl?: number;
    forceRefresh?: boolean;
  } = {}
): Promise<T> {
  const cacheKey = generateCacheKey(sql, params);
  
  // Check cache first unless forceRefresh is true
  if (options.cache && !options.forceRefresh) {
    const cachedResult = queryCache.get<T>(cacheKey);
    if (cachedResult) {
      logger.debug('Cache hit', { sql, params });
      return cachedResult;
    }
  }

  const pool = await getPool();
  try {
    logger.debug('Executing query', { sql, params });
    const startTime = Date.now();
    
    const [results] = await pool.execute<T>(sql, params);
    
    const queryTime = Date.now() - startTime;
    logger.debug('Query execution time', { sql, time: `${queryTime}ms` });

    // Cache the results if caching is enabled and query time is significant
    if (options.cache && queryTime > 50) { // Only cache if query takes more than 50ms
      queryCache.set(cacheKey, results, options.ttl);
      logger.debug('Cached query result', { sql, params });
    }
    
    return results;
  } catch (error) {
    logger.error('Query execution failed', error);
    throw error;
  }
}

export async function executeTransaction<T>(callback: (connection: Connection) => Promise<T>): Promise<T> {
  const pool = await getPool();
  const connection = await pool.getConnection();
  
  try {
    logger.debug('Starting database transaction');
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    logger.debug('Transaction committed successfully');
    return result;
  } catch (error) {
    logger.error('Transaction failed, rolling back', error);
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    logger.debug('Database connection released back to pool');
  }
}

// Graceful shutdown handler with connection draining
async function gracefulShutdown(): Promise<void> {
  if (connectionPool) {
    logger.info('Starting graceful shutdown of database connections...');
    try {
      await connectionPool.end();
      logger.info('All database connections closed successfully');
    } catch (error) {
      logger.error('Error during database shutdown', error);
    }
    connectionPool = null;
  }
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);