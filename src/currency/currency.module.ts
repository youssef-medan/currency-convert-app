import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { Transaction, TransactionSchema } from 'src/schemas/Transaction.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { CurrencyBeaconService } from './services/CurrencyBeaconService';
import { TransactionModelService } from './services/TransactionModelService';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule
  ],
  controllers: [CurrencyController],
  providers: [CurrencyService,CurrencyBeaconService,TransactionModelService],
})
export class CurrencyModule {}
