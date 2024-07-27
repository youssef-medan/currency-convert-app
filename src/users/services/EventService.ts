import { EventEmitter2 } from "@nestjs/event-emitter";
import { ForgetPasswordEvent, UserCreatedEvent } from "../events";
import { Injectable } from "@nestjs/common";
@Injectable()
export class EventService{
    constructor(private eventEmitter: EventEmitter2,){}
    
    userCreatedEvent(email:string){
        const event = new UserCreatedEvent(email)
       return this.eventEmitter.emit('user.created',event)
    }

    forgetPasswordEvent(email:string,url:string){
        const event = new ForgetPasswordEvent(email,url)
       return this.eventEmitter.emit('user.password.reset',event)
    }
}
    
