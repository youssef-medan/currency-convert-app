import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtStrategy } from './jwt.strategy';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService:UsersService

  const mockUser = { _id: 'someUserId', email: 'test@example.com' };
 const mockUsersService = {
    signup: jest.fn().mockResolvedValue({ token:'someToken', user: mockUser }),
    signin: jest.fn().mockResolvedValue({ token:'someToken', user: mockUser }),
    forgetPassword: jest.fn().mockResolvedValue(expect.any(String)),
    resetPassword: jest.fn().mockResolvedValue(expect.any(String)),
  }
  const authCredentialsDto = { email: 'test@test.com', password: 'test123' };




  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
            provide: UsersService,
            useValue: mockUsersService,
          },
      ],
    }).overrideGuard(JwtStrategy).useValue({canActivate: () => true}).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('signUp',()=>{
      it('should call UsersService.signup method', async () => {
       const result = await usersController.signup(authCredentialsDto);
        expect(mockUsersService.signup).toHaveBeenCalledWith(authCredentialsDto);
        expect(result).toEqual({ token:'someToken', user: mockUser });
      });
  })

  describe('signIn',()=>{
    it('should call UsersService.signup method',async()=>{
        const result = await usersController.signin(authCredentialsDto)
        expect(mockUsersService.signin).toHaveBeenCalledWith(authCredentialsDto);
        expect(result).toEqual({ token:'someToken', user: mockUser });
    })
  })

  describe('forgetPassword',()=>{
    it('should call UsersService.forgetPassword method',async()=>{
      const forgetPasswordDto = {email:'example@example.com'}
        const result = await usersController.forgetPassword(forgetPasswordDto)
        expect(mockUsersService.forgetPassword).toHaveBeenCalledWith(forgetPasswordDto);
        expect(result).toEqual('test@test.com');
    })
  })

  describe('resetPassword',()=>{
    it('should call UsersService.resetPassword method',async()=>{
        const resetPasswordDto = {password:'aaa',passwordConfirm:'aaa'}
        const result = await usersController.resetPassword('token',resetPasswordDto)
        expect(mockUsersService.resetPassword).toHaveBeenCalledWith('token',resetPasswordDto);
        expect(result).toEqual('test@test.com');
    })
  })

  

});
