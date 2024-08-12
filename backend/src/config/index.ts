import * as dotenv from 'dotenv';
import { Config } from '../models/Common';

dotenv.config({ path: './.env' });

const env: { [key: string]: unknown } = {
  port: process.env['HTTP_PORT'] || 5000,
};

const buildConfig = (): Config => {
  return {
    http: {
      port: env.port as number
    },
  };
};

export const config = buildConfig();
