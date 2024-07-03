import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import commonConfig from '~/configs/orm.config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor() {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return commonConfig;
  }
}
