import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({description:'Enter New Password',example:'123456',required:true})
  @IsNotEmpty()
  password: string;
  @ApiProperty({description:'Confirm New Password',example:'123456',required:true})
  @IsNotEmpty()
  passwordConfirm: string;
  
}
