import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException } from "@nestjs/common";
import { IsEmail } from "class-validator";

describe('AuthSErvice',()=>{
    let service: AuthService;
    let fakeUsersSErvice: Partial<UsersService>;

    beforeEach(async ()=>{
        const users:User[] = [];
        
        // create a fake copy of users service
        fakeUsersSErvice = {
            find:(email:string)=>{
                const filteredusers = users.filter(user=>user.email === email)
                return Promise.resolve(filteredusers)
            },
            create:(email:string,password:string)=>{
                const user = {id:Math.random() * 999999,email,password} as User
                users.push(user);
                return Promise.resolve(user);
            }
        };

        const module =  await Test.createTestingModule({
            providers:[
                AuthService,
                {
                    provide:UsersService,
                    useValue:fakeUsersSErvice
                },
            ]
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service',async()=>{

        expect(service).toBeDefined();
    })

    it('create a new user with a salted and hashed password',async ()=>{
        const user = await service.signup('asdf@asdf.com','asdf')

        expect(user.password).not.toEqual('asdf');
        const [salt,hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use',async ()=>{
        // fakeUsersSErvice.find = () => Promise.resolve([{id:1,email:'a',password:'1'} as User])
        
        // here we need to add rejects because it is used to handle rejection form promises
        // we could have simply done expect().toThorw() if it was a synchronous taks
        // reject is a keyword given by jest library to handle error in promise..
        
        await service.signup('asdf@asdf.com','asdf');
        await expect(service.signup('asdf@asdf.com','asdf')).rejects.toThrow(BadRequestException);
        
    })

    it('throws if signin is called with and unused email',async()=>{
        await expect(service.signin('asdf@asdf.com','pass')).rejects.toThrow();
    })

    it('throw if an invalid password is provided',async ()=>{
        // fakeUsersSErvice.find = () => Promise.resolve([{email:'asdf.asdf.com',password:'iaskdjf'} as User])
        await service.signup('isdfsdf@gmsadf.com','password123')

        await expect(service.signin('isdfsdf@gmsadf.com','password')).rejects.toThrow();
        // await service.signin('isdfsdf@gmsadf.com','password')
    })

    it('returns a user if correctPassword is provided',async ()=>{
        // fakeUsersSErvice.find = () => Promise.resolve([{email:'asdf.asdf.com',password:'6c5cb5bb5f263caa.57973c5727995a71bb9640594824948a5d3206321316e449216986d3665cd777'} as User])
        await service.signup('asdf@asdf.com','mypassword');

        const user = await service.signin('asdf@asdf.com','mypassword')

        expect(user).toBeDefined();
        // const user = await service.signup('asdf@asdf.com','mypassword');

        // console.log(user); 
    })
})
