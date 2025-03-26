// src/config.ts
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface Config {
  port: number;
  baseUrl: string;
  webhookBaseUrl?: string;
  omnoClientId?: string;
  omnoClientSecret?: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  baseUrl: process.env.BASE_URL || 'http://localhost',
  webhookBaseUrl: process.env.WEBHOOK_BASE_URL,
  omnoClientId: process.env.OMNO_CLIENT_ID,
  omnoClientSecret: process.env.OMNO_CLIENT_SECRET,
};

export default config;