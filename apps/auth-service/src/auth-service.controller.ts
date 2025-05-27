import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth-service.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login' })
  async login(data: { username: string; password: string }) {
    const user = await this.authService.validateUser(data.username, data.password);
    return this.authService.login(user);
  }

  @MessagePattern({ cmd: 'verify_token' })
  async verifyToken(token: string) {
    return this.authService.verifyToken(token);
  }
}