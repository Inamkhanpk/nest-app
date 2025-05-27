import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AppController } from './app.controller';

import { RedisModule } from 'libs/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_ || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT) ||  5433,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'Inamkhan@123',
      database: process.env.POSTGRES_DB || 'user-service',
      entities: [User],
      synchronize: true,
    }),
    
    TypeOrmModule.forFeature([User]),
    RedisModule

  ],
  controllers: [AppController],
})
export class AppModule {}



// host: 'localhost' ,
// port: 5433,
// username: 'postgres',
// password: 'Inamkhan@123',
// database: 'user-service',