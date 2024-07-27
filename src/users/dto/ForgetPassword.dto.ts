import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForgetPasswordDto {
    @ApiProperty({description:'Enter Your Email',required:true,example:'example@gmail.com'})
    @IsNotEmpty()
    email:string
}