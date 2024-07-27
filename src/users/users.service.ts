import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/AuthCredentials.dto';
import { User } from '../schemas/User.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResetPasswordDto } from './dto/ResetPassword.dto';
import { AuthService } from './services/AuthService';
import { ModelService } from './services/UserModelService';
import { EventService } from './services/EventService';
import { ForgetPasswordDto } from './dto/ForgetPassword.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private authService: AuthService,
    private modelService: ModelService,
    private eventService: EventService,
  ) {}

 
  async signup(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;
    const auth = await this.authService.hashPassword(password);
    const credentials = Object.assign({email,password: auth.hashedPassword,salt: auth.salt,});
    const user = await this.modelService.signUp(this.userModel, credentials);
    const token = this.authService.generateToken(user._id);
    this.eventService.userCreatedEvent(user.email);
    return { token, user };
  }

  async signin(authCredentialsDto: AuthCredentialsDto) {
    const user = await this.modelService.signIn(this.userModel,authCredentialsDto);
    const token = this.authService.generateToken(user._id);
    return { token, user };
  }

  async forgetPassword(forgetPasswordDto:ForgetPasswordDto) {
    const {email} = forgetPasswordDto
    const resetToken = await this.modelService.forgetPassword(this.userModel,email);
    const resetURL = `http://localhost:3000/users/resetPassword/${resetToken}`;
    this.eventService.forgetPasswordEvent(email, resetURL);
    return {message:'Check your email for password reset instructions'};
  }

  async resetPassword(resetToken: string, resetPasswordDto: ResetPasswordDto) {
    const { password, passwordConfirm } = resetPasswordDto;
    if (password !== passwordConfirm) throw new UnauthorizedException('Passwords does not match');
    const hashedToken = this.authService.hashToken(resetToken);
    const {hashedPassword,salt} = await this.authService.hashPassword(password);
    await this.modelService.resetPassword(this.userModel,hashedPassword,hashedToken,salt);
    return {message:'Password has been reset successfully'};
  }
}
