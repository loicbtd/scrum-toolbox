import { DataSource } from 'typeorm';

export interface DatabaseInterface {
  id: string;
  dataSource: DataSource;
}
