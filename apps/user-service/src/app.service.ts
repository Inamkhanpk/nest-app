import { Injectable  ,Inject} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { REDIS_CLIENT } from 'libs/redis/redis.module';
import Redis from 'ioredis';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../../libs/common/src/dto/create-user.dto';
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

  async createUser(dto: CreateUserDto) {
   const hashed = await bcrypt.hash(dto.password, 10);
      const user = this.userRepo.create({ ...dto, password: hashed });
      
     return this.userRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
}