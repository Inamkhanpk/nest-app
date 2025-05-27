import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { AppController } from './app.controller'
import { RedisModule } from 'libs/redis/redis.module';
import { KafkaModule } from 'libs/kafka-lib/src/app.module';
// import { KafkaConfig } from './../../../libs/kafka-lib/src/kafka.interface';


// const kafkaConfig: KafkaConfig = {
//   clientId: 'order-service',
//   brokers: ['localhost:9092'],
// };
@Module({
  imports: [
    KafkaModule,
    MongooseModule.forRoot('mongodb://localhost:27017/order_service'),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
   
    RedisModule
  ],
  controllers: [AppController],
})
export class AppModule {}