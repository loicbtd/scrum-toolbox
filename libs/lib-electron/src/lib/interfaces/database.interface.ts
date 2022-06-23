import { Connection } from 'typeorm';

export interface DatabaseInterface {
  id: string;
  connection: Connection;
}
