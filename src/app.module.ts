import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencyModule } from './currency/currency.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://ymedan:155255355@currency-exchange-app.94vhuet.mongodb.net/currency-exchange-app',
    ),
    EventEmitterModule.forRoot({ wildcard: true, delimiter: '.', newListener: true, }),
    UsersModule,
    CurrencyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
