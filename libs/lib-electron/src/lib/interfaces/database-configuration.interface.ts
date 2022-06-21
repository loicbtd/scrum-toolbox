import { ConnectionOptions } from 'typeorm';

export interface DatabaseConfigurationInterface {
  id: string;
  connectionOptions: ConnectionOptions;
}
