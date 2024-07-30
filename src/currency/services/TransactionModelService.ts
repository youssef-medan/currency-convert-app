import { BadRequestException, HttpException } from "@nestjs/common";
import { Model } from "mongoose";
import { Transaction } from "src/schemas/Transaction.schema";
import { User } from "src/schemas/User.schema";


export class TransactionModelService {
    constructor(){}

    async createTransaction(transactionModel:Model<Transaction>,transactionInfo:Transaction){
        const transaction = await transactionModel.create(transactionInfo)
        if(!transaction) throw new BadRequestException('invalid transaction')
        return {transaction}

    }

    async myTransaction(transactionModel:Model<Transaction>,user:User){
       const transactions = await transactionModel.find({user:user['_id']})
       const results = transactions.length
       return {results,transactions}

    }
    
}