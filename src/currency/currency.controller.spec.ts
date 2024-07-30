import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { JwtStrategy } from '../users/jwt.strategy';

describe('CurrencyController', () => {
  let currencyController: CurrencyController;

  const mockTransaction = {
    from: 'USD',
    to: 'EGP',
    amount: 1,
    value: 50,
    date: new Date(),
    user: { _id: 'someUserId' },
  } as any;

  const mockTransactions = [
    {
      from: 'USD',
      to: 'EGP',
      amount: 1,
      value: 50,
      date: new Date(),
      user: { _id: 'someUserId' },
    },
  ] as any;
  const mockCurrencyService = {
    convertCurrency: jest.fn().mockResolvedValue(mockTransaction),
    saveTransaction:jest.fn().mockResolvedValue(mockTransaction),
    myTransaction: jest.fn().mockResolvedValue({ results:mockTransactions.length, transactions:mockTransactions }),
  }



  const mockUser = { _id: 'someUserId', email: 'test@example.com' } as any;
  const mockConvertCurrencyDto = { from: 'USD', to: 'EGP', amount: 1 };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [{provide:CurrencyService,useValue:mockCurrencyService}],
    }).overrideGuard(JwtStrategy).useValue({canActivate: () => true}).compile();

    currencyController = module.get<CurrencyController>(CurrencyController);
  });

  it('should be defined', () => {
    expect(currencyController).toBeDefined();
  });

  describe('currencyConvert',()=>{
    it('should return Transaction', async () => {
      const result = await currencyController.convertCurrency(mockConvertCurrencyDto, mockUser);
      expect(mockCurrencyService.convertCurrency).toHaveBeenCalledWith(mockConvertCurrencyDto, mockUser);
      expect(result).toEqual(mockTransaction);

    })
  })
  describe('myTransaction', ()=>{
    it('should return my Transactions', async () => {
      const result = await currencyController.myTransaction(mockUser);
      expect(mockCurrencyService.myTransaction).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ results:mockTransactions.length, transactions:mockTransactions });

    })
  })
});
