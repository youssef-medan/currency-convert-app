import { Injectable } from '@nestjs/common';
import { ConvertCurrencyDto } from './dto/convertCurrency.dto';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from '../schemas/Transaction.schema';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CurrencyBeaconService } from './services/CurrencyBeaconService';
import { TransactionModelService } from './services/TransactionModelService';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
    private currencyBeaconService: CurrencyBeaconService,
    private transactionModelService: TransactionModelService,
  ) {}
  
  async convertCurrency(convertCurrencyDto: ConvertCurrencyDto, user: User) {
    const transaction = await this.currencyBeaconService.getCurrencyConvert(convertCurrencyDto,user);
    return this.saveTransaction(transaction); 
  }

  async saveTransaction(transaction:Transaction){
  return await this.transactionModelService.createTransaction(this.transactionModel,transaction)
  }

  async myTransaction(user: User) {
    const  { results, transactions }  = await this.transactionModelService.myTransaction(this.transactionModel,user)
    return { results, transactions };
  }
}
