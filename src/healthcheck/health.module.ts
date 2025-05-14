import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HealthCheckController } from '~/healthcheck/health.controller';

@Module({
  imports: [TerminusModule, TypeOrmModule],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
