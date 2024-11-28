import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService:Partial<UsersService>;
  let fakeAuthService:Partial<AuthService>;


  beforeEach(async () => {
    fakeUsersService = {
      findOne:(id:number)=>{
        return Promise.resolve({id,email:'asdf.@asdf.com',password:'asdf'} as User)
      },
      find:(email:string)=>{
        return Promise.resolve([{id:1,email,password:'asdf'} as User])
      },
      // remove:()=>{

      // },
      // update:()=>{}
    };

    fakeAuthService = {
      // signup:()=>{}
      signin:(email:string,password:string)=>{
        return Promise.resolve({id:1,email,password} as User)
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers:[
        {
          provide:UsersService,
          useValue:fakeUsersService
        },
        {
          provide:AuthService,
          useValue:fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the give email',async ()=>{
    const users = await controller.findAllUsers('asdf@asdf.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  })

  it('findUsers returns a single user with the given id',async ()=>{
    const user = await controller.findUser('1');

    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    // Mock findOne to throw a NotFoundException
    fakeUsersService.findOne = jest.fn().mockImplementation(() => {
      throw new NotFoundException('User not found');
    });
  
    // Test that findUser throws the NotFoundException
    await expect(controller.findUser('1')).rejects.toThrowError('User not found');
  });

  it('signin updates session object and return user',async ()=>{
    const session = {userId:-10};
    const user = await controller.signin(
      {email:'asdf@asdf.com',password:'asdf'},
      session
    )

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  })
});
