import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ConvertCurrencyDto } from './dto/convertCurrency.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorator/get-user.decorator';
import { User } from '../schemas/User.schema';
import { ErrorsInterceptor } from '../global interceptors/errors.interceptor';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Transaction } from '../schemas/Transaction.schema';
import { RequestGuard } from '../guards/request.guard';

@ApiTags('Currency')
@ApiBearerAuth('JWT-auth')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('/convert')
  @UseInterceptors(ErrorsInterceptor)
  @UseGuards(AuthGuard())
  @ApiOkResponse({description:'return amount and its converted valueas response as Transaction object and save it',type:Transaction})
  @ApiNotFoundResponse({description:'Not Found! make sure you use avaliable currencies or try again later'})
  @ApiBadRequestResponse({description:'invalid transaction'})
  @ApiUnauthorizedResponse({description:'Unauthorized'})
  async convertCurrency(
    @Query() convertCurrencyDto: ConvertCurrencyDto,
    @GetUser() user:User
  ): Promise<any> {
    return this.currencyService.convertCurrency(convertCurrencyDto,user);
  }

  @Get('my-transactions')
  @UseInterceptors(ErrorsInterceptor)
  @UseGuards(AuthGuard(),RequestGuard)
  @ApiOkResponse({description:'return array of user`s Transactions',type:[Transaction]})
  @ApiUnauthorizedResponse({description:'Unauthorized'})
  async myTransaction(@GetUser() user:User): Promise<any> {
    return this.currencyService.myTransaction(user);
  }

}
