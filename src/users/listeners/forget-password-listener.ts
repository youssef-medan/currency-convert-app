import { Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { ForgetPasswordEvent } from "../events";
import { ClientProxy } from "@nestjs/microservices";


@Injectable()

export class ForgetPasswordListener{
    constructor(@Inject('EMAIL_SERVICE') private readonly emailClient:ClientProxy){}

    @OnEvent('user.password.reset')
   async handlePasswordReset(event:ForgetPasswordEvent){
    this.emailClient.emit('user-forgetPassword',event)


    }
    
    
}