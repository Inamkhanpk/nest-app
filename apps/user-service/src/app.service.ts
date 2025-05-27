import { Injectable  ,Inject} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { REDIS_CLIENT } from 'libs/redis/redis.module';
import Redis from 'ioredis';

@Injectable()
export class UserService {
  constructor(
   @InjectRepository(User)
    private readonly userRepo: Repository<User>,
     @Inject(REDIS_CLIENT) private readonly redis: Redis,
   
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.find();
  }



  async findById(id: number): Promise<User | null> {
    const cachedUser = await this.redis.get(`user:${id}`);
  
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.userRepo.findOne({ where: { id } });
    if (user) {
      await this.redis.set(`user:${id}`, JSON.stringify(user), 'EX', 3600);
    }

    return user;
  }

  async createUser(userData:User) :  Promise<User>{
      const user = this.userRepo.create(userData);
     return this.userRepo.save(user);
  }
}