import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserCreatedListener } from './listeners/user.created-listener';
import { ForgetPasswordListener } from './listeners/forget-password-listener';
import { AuthService } from './services/AuthService';
import { ModelService } from './services/UserModelService';
import { EventService } from './services/EventService';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: 'ymedan', signOptions: { expiresIn: '12h' } }),
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqps://csevpycf:nxQsVAbVrVB9F9OYaWViKtbrJb3bNxtz@stingray.rmq.cloudamqp.com/csevpycf'],
          queue: 'email_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService,JwtStrategy,UserCreatedListener,ForgetPasswordListener,AuthService,ModelService,EventService],
  exports:[UsersService, JwtStrategy, PassportModule]
})
export class UsersModule {}
