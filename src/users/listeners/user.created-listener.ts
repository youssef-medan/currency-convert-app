import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { UserCreatedEvent } from '../events';

@Injectable()
export class UserCreatedListener {
  constructor(@Inject('EMAIL_SERVICE') private readonly emailClient:ClientProxy ) {}
  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    this.emailClient.emit('user-created',event)
    
    
  }
}
