import { User } from '../models/userModel';

export {};

declare global {
  namespace Express {
    interface Request {
      cookies: { token?: string };
      user: User | null;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      JWT_EXPIRE: string;
      COOKIE_EXPIRE: string;
      PORT: '5001' | '3001';
      LOCAL_DB_URL: string;
      JWT_SECRET_KEY: string;
    }
  }
}