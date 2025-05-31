import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth-service.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth_signup' })
  signup(data: any) {
    return this.authService.signup(data);
  }

  @MessagePattern({ cmd: 'auth_signin' })
  signin(data: any) {
    return this.authService.signin(data);
  }

  @MessagePattern({ cmd: 'auth_signout' })
  signout() {
    return this.authService.signout();
  }
}