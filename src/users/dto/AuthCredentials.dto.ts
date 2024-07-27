import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({description:'enter your Email address',example:'user@gamil.com'})
  @IsNotEmpty()
  email: string;
  @ApiProperty({description:'enter your Password',example:123456})
  @IsNotEmpty()
  password: string;
}
