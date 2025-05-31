import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from '../../../libs/common/src/dto/create-user.dto';
import { SignInDto } from '../../../libs/common/src/dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  async signup(dto: CreateUserDto) {
    const user = await this.userClient.send({ cmd: 'create_user' }, dto).toPromise();
    return this.generateToken(user);
  }

  async signin(dto: SignInDto) {
    const user = await this.userClient.send({ cmd: 'get_user_by_email' }, dto.email).toPromise();
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    return this.generateToken(user);
  }

  signout() {
    return { message: 'Signed out' };
  }

  private generateToken(user: any) {
    const payload = { email: user.email, sub: user._id };
    return { token: jwt.sign(payload, 'SECRET', { expiresIn: '1d' }) };
  }
}