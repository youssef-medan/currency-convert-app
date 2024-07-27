import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { ForgetPasswordEvent, TaskCreatedEvent, UserCreatedEvent } from './events';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @EventPattern('task-created')
  handleTaskCreated(taskInfo:TaskCreatedEvent) {
    return this.appService.handleTaskCreated(taskInfo);
  }

  @EventPattern('user-created')
  handleUserCreated(userInfo:UserCreatedEvent) {
    this.appService.handleUserCreated(userInfo);
  }
  @EventPattern('user-forgetPassword')
  handleUserForgetPassword(userInfo:ForgetPasswordEvent) {
    this.appService.handleForgetPassword(userInfo);
  }
  


}
