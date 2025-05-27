import { Controller ,Inject} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis  } from '@nestjs-modules/ioredis';
import { REDIS_CLIENT } from 'libs/redis/redis.module';
import {UserService} from './app.service'
 
@Controller()
export class AppController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly userService: UserService
  ) {}

  @MessagePattern({ cmd: 'get_users' })
  async getUsers() {
    return this.userService.getAllUsers();
  }

  @MessagePattern({ cmd: 'get_user' })
  async getUser(id: number): Promise<User|null> {
  return this.userService.findById(id);
    
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(userData: User): Promise<User> {
  return this.userService.createUser(userData)
  }
}