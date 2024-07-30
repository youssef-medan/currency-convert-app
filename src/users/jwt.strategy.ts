import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/User.schema';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    //  private userRepository: UserRepository,
     @InjectModel(User.name) private userModel : Model<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'ymedan',
    });
  }

  async validate(payload: JwtPayload,req) {
    const { id } = payload;
    const user = await this.userModel.findById(id).select('-__v -password -salt');
    if (!user) throw new UnauthorizedException('please login to get access');
    return user;
  }
}
