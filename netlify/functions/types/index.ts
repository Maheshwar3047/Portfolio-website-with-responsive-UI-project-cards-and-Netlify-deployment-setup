export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: Date;
}

export interface APIResponse<T = any> {
  statusCode: number;
  body: string;
  headers?: {
    [key: string]: string | number | boolean;
  };
}