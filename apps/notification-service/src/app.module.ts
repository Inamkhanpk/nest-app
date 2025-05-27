import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaModule } from 'libs/kafka-lib/src/app.module';




@Module({
  imports: [KafkaModule],
  providers: [AppService],
})
export class AppModule {}