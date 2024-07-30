import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from '../schemas/User.schema';
import { EventService } from './services/EventService';
import { AuthCredentialsDto } from './dto/AuthCredentials.dto';
import { ResetPasswordDto } from './dto/ResetPassword.dto';
import { ModelService } from './services/UserModelService';
import { AuthService } from './services/AuthService';
import { NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { Model } from 'mongoose';
import { JwtStrategy } from './jwt.strategy';


describe('UsersService', () => {
    let usersService: UsersService;
    let authService: Partial<AuthService>;
    let modelService: Partial<ModelService>;
    let eventService: Partial<EventService>;
    let model:Model<User>
  
    const mockAuthCredentialsDto: AuthCredentialsDto = { email: 'test@example.com', password: 'password' };
    const mockUser = { _id: 'someUserId', email: 'test@example.com' } as any;

  
   const mockUserModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete:jest.fn(),
    create: jest.fn(),
    deleteOne: jest.fn(),
    populate: jest.fn(),
    save: jest.fn(),
   }
  beforeEach(async () => {
    authService = {
      hashPassword: jest.fn(),
      generateToken: jest.fn(),
      hashToken: jest.fn(),
    };

    modelService = {
      signUp: jest.fn(),
      signIn: jest.fn(),
      forgetPassword: jest.fn(),
      resetPassword: jest.fn(),
    };

  

    eventService = {
      userCreatedEvent: jest.fn(),
      forgetPasswordEvent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: {mockUserModel} },
        { provide: AuthService, useValue: authService },
        { provide: ModelService, useValue: modelService },
        { provide: EventService, useValue: eventService },
      ],
    }).overrideGuard(JwtStrategy).useValue({canActivate: () => true}).compile();

    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    modelService = module.get<ModelService>(ModelService);
    eventService = module.get<EventService>(EventService);
    model = module.get<Model<User>>(getModelToken(User.name));

  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('signup', () => {
    it('should sign up a user and return a token and user object', async () => {
      const mockAuthCredentialsDto: AuthCredentialsDto = { email: 'test@example.com', password: 'password' };
      const mockUser = { _id: 'someUserId', email: 'test@example.com' };
      
     jest.spyOn(authService, 'hashPassword').mockResolvedValue({ hashedPassword: 'hashedPassword', salt: 'salt' });
     jest.spyOn(modelService, 'signUp').mockResolvedValue(mockUser);
     jest.spyOn(authService, 'generateToken').mockReturnValue('token');
     jest.spyOn(eventService, 'userCreatedEvent').mockReturnValue(null);
  
      const result = await usersService.signup(mockAuthCredentialsDto);
  
      expect(result).toEqual({ token: 'token', user: mockUser });
      expect(authService.hashPassword).toHaveBeenCalledWith('password');
      expect(modelService.signUp).toHaveBeenCalledWith(expect.anything(), {
        email: 'test@example.com',
        password: 'hashedPassword',
        salt: 'salt',
      });
      expect(authService.generateToken).toHaveBeenCalledWith(mockUser._id);
      expect(eventService.userCreatedEvent).toHaveBeenCalledWith('test@example.com');
    });
    it('should Conflect Exception', async () => {
      const mockAuthCredentialsDto: AuthCredentialsDto = { email: 'test@example.com', password: 'password' };
      
     jest.spyOn(authService, 'hashPassword').mockResolvedValue({ hashedPassword: 'hashedPassword', salt: 'salt' });
     jest.spyOn(modelService, 'signUp').mockRejectedValue(new ConflictException());
     jest.spyOn(authService, 'generateToken').mockReturnValue('token');
     jest.spyOn(eventService, 'userCreatedEvent').mockReturnValue(null);
  
     const result = usersService.signup(mockAuthCredentialsDto);
     expect(result).rejects.toThrow(ConflictException);
     expect(authService.hashPassword).toHaveBeenCalledWith('password');
      expect(authService.generateToken).not.toHaveBeenCalled();
      expect(eventService.userCreatedEvent).not.toHaveBeenCalledWith();
    });
  });


  describe('signin', () => {
    it('should sign in a user and return a token and user object', async () => {
      
      jest.spyOn(modelService, 'signIn').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'generateToken').mockReturnValue('token');
  
      const result = await usersService.signin(mockAuthCredentialsDto);
  
      expect(result).toEqual({ token: 'token', user: mockUser });
      expect(modelService.signIn).toHaveBeenCalledWith(expect.anything(), mockAuthCredentialsDto);
      expect(authService.generateToken).toHaveBeenCalledWith(mockUser._id);
    });
    it('should return UnauthorizedException', async () => {
      jest.spyOn(modelService, 'signIn').mockRejectedValue(new UnauthorizedException('Invalid credentials'))
      const generateTokenSpy =  jest.spyOn(authService, 'generateToken').mockReturnValue('token');
      expect( usersService.signin(mockAuthCredentialsDto)).rejects.toThrow(UnauthorizedException);
      expect(generateTokenSpy).not.toHaveBeenCalled();
    });
  });

  describe('forget password',()=>{
    it('should send email with link to create new password',async ()=>{

        jest.spyOn(modelService,'forgetPassword').mockResolvedValue('token')
        jest.spyOn(eventService,'forgetPasswordEvent').mockReturnValue(null)
        const result = await usersService.forgetPassword(mockUser.email)
        expect(result).toEqual({message:'Check your email for password reset instructions'});
        

    })
  })

  describe('reset password',()=>{
    it('should reset your password', async()=>{
      const resetPasswordDto = {password:'aaa',passwordConfirm:'aaa'}
      jest.spyOn(authService,'hashToken').mockReturnValue('token')
      jest.spyOn(authService,'hashPassword').mockResolvedValue({ hashedPassword: 'hashedPassword', salt: 'salt' })
      jest.spyOn(modelService,'resetPassword').mockReturnValue(null)
      const result = await usersService.resetPassword('token',resetPasswordDto)
      expect(result).toEqual({message:'Password has been reset successfully'})
    })
    it('should return UnauthorizedException', async()=>{
      const resetPasswordDto = {password:'aaaa',passwordConfirm:'aaa'}
      jest.spyOn(authService,'hashToken').mockReturnValue('token')
      jest.spyOn(authService,'hashPassword').mockResolvedValue({ hashedPassword: 'hashedPassword', salt: 'salt' })
      jest.spyOn(modelService,'resetPassword').mockReturnValue(null)
      const result =  usersService.resetPassword('token',resetPasswordDto)
      expect(result).rejects.toThrow(UnauthorizedException)
    })
  })

 
});