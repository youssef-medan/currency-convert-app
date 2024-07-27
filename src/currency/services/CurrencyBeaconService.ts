import axios from "axios";
import { ConvertCurrencyDto } from "../dto/convertCurrency.dto";
import { User } from "src/schemas/User.schema";
import { HttpException, NotFoundException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common/exceptions";

export class CurrencyBeaconService {
    constructor(){}
    private readonly apiUrl = 'https://api.currencybeacon.com/v1/';
    private readonly apiKey = '4hmd4f2SzcxOWlAYZfqJT62fCNyCLLva';

    async getCurrencyConvert(convertCurrencyDto:ConvertCurrencyDto,user:User): Promise<any> {
        const {from,to,amount} = convertCurrencyDto
        const url = `${this.apiUrl}convert?api_key=${this.apiKey}&from=${from}&to=${to}&amount=${amount}`;
        
            const response = await axios.get(url)
            .catch(function (error) {if (error.response){throw new BadRequestException(`${error.code} , make sure you use avaliable currencies or try again later`)}})
            const transaction = JSON.parse(JSON.stringify(response['data']['response']));
            transaction.date = Date.now();
            transaction.user = user['_id']
            return transaction
            
            

    }

}