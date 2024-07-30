import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { AuthCredentialsDto } from '../dto/AuthCredentials.dto';

export class ModelService {
  constructor() {}
  async signUp(userModel: Model<User>, credentials) {
    try {
      const user = await userModel.create(credentials);
      user.password = undefined;
      user.salt = undefined;
      return user;
    } catch (error) {
      if (error.code === 11000)
        throw new ConflictException(
          Object.keys(error.keyValue) + ' ' + 'is aready taken',
        );
      else return error;
    }
  }

  async signIn(userModel: Model<User>, authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isMatch = await user.validatePassword(password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    user.password = undefined;
    user.salt = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.__v = undefined;
    return user;
  }

  async forgetPassword(userModel: Model<User>, email: string) {
    const user = await userModel.findOne({ email });
    if (!user) throw new NotFoundException('No User found');
    const resetToken = await user.createPasswordResetToken();
    return resetToken;
  }

  async resetPassword(
    userModel: Model<User>,
    hashedPassword: any,
    hashedToken: string,
    salt: string,
  ) {
    const user = await userModel.findOneAndUpdate(
      {
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      },
      {
        password: hashedPassword,
        salt: salt,
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
      },
    );
    if (!user) throw new UnauthorizedException('Token Expired');
  }
}
