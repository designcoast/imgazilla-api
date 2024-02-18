import { Module } from '@nestjs/common';
import { ConnectionService } from './connection/connection.service';

@Module({
  providers: [ConnectionService]
})
export class DatabaseModule {}
