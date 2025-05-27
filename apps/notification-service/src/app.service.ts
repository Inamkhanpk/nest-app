import { Injectable, OnModuleInit,Inject } from '@nestjs/common';

import { ClientKafka } from '@nestjs/microservices';
@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleInit() {
    // Subscribe to topics
    this.kafkaService.subscribeToResponseOf('user_created');
    
    // Establish connection
    await this.kafkaService.connect();
  }
}