import { DataSourceOptions } from 'typeorm';

export interface DatabaseConfigurationInterface {
  id: string;
  dataSourceOptions: DataSourceOptions;
}
