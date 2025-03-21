import type { Handler, HandlerResponse } from '@netlify/functions';
import { RowDataPacket } from 'mysql2';
import { query } from './utils/db';
import { validateBody, validators } from './middleware/validate';
import { queryCache } from './utils/cache';
import { logger } from './utils/logger';
import { gzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);

interface MessageRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: Date;
}

interface NetlifyError extends Error {
  statusCode?: number;
}

const validateMessage = validateBody({
  name: validators.required,
  email: (value) => validators.required(value) && validators.email(value),
  message: (value) => validators.required(value) && validators.minLength(10)(value)
});

export const handler: Handler = validateMessage(async (event, context): Promise<HandlerResponse> => {
  const endTimer = logger.startTimer('messages-api', { method: event.httpMethod });
  
  try {
    switch (event.httpMethod) {
      case 'GET': {
        // Check if client supports gzip
        const acceptsGzip = event.headers['accept-encoding']?.includes('gzip');
        
        // Check if we have a matching ETag
        const ifNoneMatch = event.headers['if-none-match'];
        const cacheKey = 'messages-list';
        const cachedETag = queryCache.get<string>(`${cacheKey}-etag`);
        
        if (ifNoneMatch && cachedETag && ifNoneMatch === cachedETag) {
          return {
            statusCode: 304,
            headers: { 'ETag': cachedETag }
          };
        }

        const messages = await query<MessageRow[]>(
          'SELECT * FROM messages ORDER BY created_at DESC',
          [],
          { cache: true, ttl: 60000 } // Cache for 1 minute
        );

        const responseBody = JSON.stringify({ messages });
        const etag = Buffer.from(responseBody).toString('base64');
        queryCache.set(`${cacheKey}-etag`, etag, 60000);

        // Compress response if supported
        let body = responseBody;
        let contentEncoding = undefined;
        
        if (acceptsGzip && responseBody.length > 1024) {
          body = (await gzipAsync(responseBody)).toString('base64');
          contentEncoding = 'gzip';
        }

        const duration = endTimer();
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=60',
            'ETag': etag,
            ...(contentEncoding && { 'Content-Encoding': contentEncoding }),
            'X-Response-Time': `${duration.toFixed(2)}ms`
          },
          body,
          isBase64Encoded: !!contentEncoding
        };
      }

      case 'POST': {
        const startTime = Date.now();
        const { name, email, message } = JSON.parse(event.body || '{}');
        
        await query(
          'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
          [name, email, message]
        );

        // Invalidate both the messages cache and ETag
        queryCache.invalidate('SELECT * FROM messages ORDER BY created_at DESC-[]');
        queryCache.invalidate('messages-list-etag');

        const duration = endTimer();
        return {
          statusCode: 201,
          headers: {
            'Content-Type': 'application/json',
            'X-Response-Time': `${duration.toFixed(2)}ms`
          },
          body: JSON.stringify({ 
            message: 'Message sent successfully',
            timestamp: new Date().toISOString()
          })
        };
      }

      default:
        return {
          statusCode: 405,
          headers: {
            'Content-Type': 'application/json',
            'Allow': 'GET, POST'
          },
          body: JSON.stringify({ message: 'Method not allowed' })
        };
    }
  } catch (e) {
    const error = e as NetlifyError;
    const duration = endTimer();
    logger.error('Messages API error', error);
    
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Response-Time': `${duration.toFixed(2)}ms`
      },
      body: JSON.stringify({ 
        message: 'Operation failed',
        error: error.message || 'Unknown error',
        requestId: context.awsRequestId
      })
    };
  }
});