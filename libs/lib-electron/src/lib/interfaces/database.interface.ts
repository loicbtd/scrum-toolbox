import { DataSource } from 'typeorm';

export interface Database {
  id: string;
  dataSource: DataSource;
}
