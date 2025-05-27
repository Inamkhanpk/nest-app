import { Controller,Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import Redis from 'ioredis';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRedis  } from '@nestjs-modules/ioredis';

import { ClientKafka } from '@nestjs/microservices';
import { OnModuleInit } from '@nestjs/common';
import { REDIS_CLIENT } from 'libs/redis/redis.module';


@Controller()
export class AppController {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
  ) {}


  @MessagePattern({ cmd: 'get_orders' })
  async getOrders(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  @MessagePattern({ cmd: 'get_order' })
  async getOrder(id: string): Promise<Order> {
   
    const cachedOrder = await this.redis.get(`order:${id}`);
    if (cachedOrder) {
      return JSON.parse(cachedOrder);
    }

    const order = await this.orderModel.findById(id).exec();
    if (order) {
      await this.redis.set(`order:${id}`, JSON.stringify(order), 'EX', 3600);
    }

    return order;
  }

  @MessagePattern({ cmd: 'create_order' })
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = new this.orderModel(orderData);
    
    const savedOrder = await order.save();
   
    // Send Kafka event
    try {
      await this.kafkaService.emit('order-created', {
        orderId: savedOrder._id,
        userId: savedOrder.userId,
        product: savedOrder.product,
        quantity: savedOrder.quantity,
      }).toPromise();
  
      console.log('✅ Kafka event emitted successfully');
    } catch (err) {
      console.error('❌ Kafka emit failed:', err.message || err);
    }
   
    // await this.kafkaService.emit('order-created', {
    //   orderId: savedOrder._id,
    //   userId: savedOrder.userId,
    //   product: savedOrder.product,
    //   quantity: savedOrder.quantity,
    // });

    return savedOrder;
  }
}