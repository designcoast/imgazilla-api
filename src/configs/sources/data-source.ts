import { DataSource } from 'typeorm';
import commonConfig from '../orm.config';

export const AppDataSource = new DataSource(commonConfig);
