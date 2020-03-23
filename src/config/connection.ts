import { config } from 'dotenv';
import { getConnectionOptions, createConnection } from 'typeorm';

config();

export const typeormConnection = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({ ...connectionOptions, name: 'default' });
};
