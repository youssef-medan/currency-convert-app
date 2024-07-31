import { Controller, Get, Post, Body, Patch, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthCredentialsDto } from './dto/AuthCredentials.dto';
import { ResetPasswordDto } from './dto/ResetPassword.dto';
import { ApiBody, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { User } from '../schemas/User.schema';
import { ForgetPasswordDto } from './dto/ForgetPassword.dto';
import { RequestGuard } from '../guards/request.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  @ApiOkResponse({description:'User object as response with token',type:User})
  @ApiConflictResponse({description:'this Email is already in use'})
  signup(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.usersService.signup(authCredentialsDto);
  }

  @Post('/signin')
  @UseGuards(RequestGuard)
  @ApiOkResponse({description:'User object as response with token',type:User})
  @ApiUnauthorizedResponse({description:'Invalid credentials'})
  signin(@Body() authCredentialsDto:AuthCredentialsDto) {
    return this.usersService.signin(authCredentialsDto);
  }

  @Post('/forgetpassword')
  @ApiOkResponse({description:'Check your email for password reset instructions'})
  @ApiNotFoundResponse({description:'No User Found'})
  forgetPassword(@Body()  forgetPasswordDto:ForgetPasswordDto) {
    return this.usersService.forgetPassword(forgetPasswordDto);
  }

  @Post('/resetpassword/:resetToken')
  @ApiOkResponse({description:'Password has been reset successfully'})
  @ApiUnauthorizedResponse({description:'Token Expired'})
  @ApiUnauthorizedResponse({description:'Passwords does not match'})
  resetPassword(@Param('resetToken') resetToken:string , @Body() resetPasswordDto:ResetPasswordDto) {
    return this.usersService.resetPassword(resetToken, resetPasswordDto);
  }
 
}
