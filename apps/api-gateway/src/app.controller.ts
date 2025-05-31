import { Controller, Get, Inject, Param, Post, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './../../../libs/common/src/interfaces/user.interface';
import { Order } from './../../../libs/common/src/interfaces/order.interface';
import { CreateUserDto } from '../../../libs/common/src/dto/create-user.dto';
import { SignInDto } from '../../../libs/common/src/dto/signin.dto';

@Controller()
export class AppController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy
  ) {}

  @Get('users')
  async getUsers() {
    return this.userClient.send({ cmd: 'get_users' }, {});
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.userClient.send({ cmd: 'get_user' }, id);
  }

  @Post('users')
  async createUser(@Body() user: User) {
    return this.userClient.send({ cmd: 'create_user' }, user);
  }

  @Get('orders')
  async getOrders() {
    return this.orderClient.send({ cmd: 'get_orders' }, {});
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    return this.orderClient.send({ cmd: 'get_order' }, id);
  }

  @Post('orders')
  async createOrder(@Body() order: Order) {
    return this.orderClient.send({ cmd: 'create_order' }, order);
  }
 @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authClient.send({ cmd: 'auth_signup' }, dto);
  }

  @Post('signin')
  signin(@Body() dto: SignInDto) {
    return this.authClient.send({ cmd: 'auth_signin' }, dto);
  }

  @Post('signout')
  signout() {
    return this.authClient.send({ cmd: 'auth_signout' }, {});
  }
}