import type { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';

export interface ValidationRules {
  [key: string]: (value: any) => boolean;
}

export function validateBody(rules: ValidationRules) {
  return (handler: Handler): Handler => {
    return async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
      if (event.httpMethod !== 'POST') {
        const result = await handler(event, context);
        return result || {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: 'Success' })
        };
      }

      try {
        const body = JSON.parse(event.body || '{}');
        const errors: string[] = [];

        Object.entries(rules).forEach(([field, validator]) => {
          if (!validator(body[field])) {
            errors.push(`Invalid ${field}`);
          }
        });

        if (errors.length > 0) {
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ errors })
          };
        }

        const result = await handler(event, context);
        return result || {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: 'Success' })
        };
      } catch (error) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Invalid request body' })
        };
      }
    };
  };
}

export const validators = {
  required: (value: any) => value !== undefined && value !== null && value !== '',
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: (length: number) => (value: string) => value?.length >= length,
  maxLength: (length: number) => (value: string) => value?.length <= length
};