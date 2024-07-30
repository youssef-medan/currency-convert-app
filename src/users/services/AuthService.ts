import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from "crypto";


@Injectable()
export class AuthService {
    
    constructor(
        private jwtService: JwtService,
    ){
        
    }

    genSalt = async () => {return await bcrypt.genSalt()}
    async hashPassword(password:string){
        const salt = await bcrypt.genSalt()
       const hashedPassword = await bcrypt.hash(password,salt)
        return {hashedPassword,salt}
    }
     generateToken(id:any) {
         return this.jwtService.sign({ id })
     };
      
     hashToken(resetToken:string){
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
      return hashedToken

     }

     
}

