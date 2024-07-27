import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from './currency.service';
import { CurrencyBeaconService } from './services/CurrencyBeaconService';
import { TransactionModelService } from './services/TransactionModelService';
import { getModelToken } from '@nestjs/mongoose';
import { Transaction } from '../schemas/Transaction.schema';

describe('CurrencyService', () => {
  let currencyService: CurrencyService;
  let currencyBeaconService: Partial<CurrencyBeaconService>;
  let transactionModelService: Partial<TransactionModelService>;

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

  const mockUser = { _id: 'someUserId', email: 'test@example.com' } as any;

  beforeEach(async () => {
    currencyBeaconService = {
      getCurrencyConvert: jest.fn(),
    };
    transactionModelService = {
      createTransaction: jest.fn(),
      myTransaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,

        { provide: getModelToken(Transaction.name), useValue: {} },
        { provide: CurrencyBeaconService, useValue: currencyBeaconService },
        { provide: TransactionModelService, useValue: transactionModelService },
      ],
    }).compile();

    currencyService = module.get<CurrencyService>(CurrencyService);
    currencyBeaconService = module.get<CurrencyBeaconService>(CurrencyBeaconService,);
    transactionModelService = module.get<TransactionModelService>(TransactionModelService);
  });

  it('should be defined', () => {
    expect(currencyService).toBeDefined();
  });

  describe('convert currency', () => {
    it('should call getCurrency function andt return Transaction object', async () => {
      const mockConvertCurrencyDto = { from: 'USD', to: 'EGP', amount: 1 };
      jest.spyOn(currencyBeaconService, 'getCurrencyConvert').mockResolvedValue(mockTransaction);
      jest.spyOn(transactionModelService, 'createTransaction').mockResolvedValue(mockTransaction);
      const result = await currencyService.convertCurrency(mockConvertCurrencyDto,mockUser,);
      expect(currencyBeaconService.getCurrencyConvert).toHaveBeenCalledWith(mockConvertCurrencyDto,mockUser);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('saveTransaction', () => {
    it('should save the transaction and return the result', async () => {
      jest.spyOn(transactionModelService, 'createTransaction').mockResolvedValue(mockTransaction);
      const result = await currencyService.saveTransaction(mockTransaction);
      expect(result).toEqual(mockTransaction);
      expect(transactionModelService.createTransaction).toHaveBeenCalledWith({}, mockTransaction);
    });
  });


  describe('my Transaction', () => {
    it('should call myTransaction function andt return Transaction objects', async () => {
      jest.spyOn(transactionModelService, 'myTransaction').mockResolvedValue({ results: mockTransactions.length, transactions: mockTransactions });
      const result = await currencyService.myTransaction(mockUser);
      expect(transactionModelService.myTransaction).toHaveBeenCalledWith({},mockUser);
      expect(result).toEqual({results:mockTransactions.length,transactions:mockTransactions});
    });
  });
});
