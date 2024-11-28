import { Body, Controller,Post,Get,Patch,Query, Param,Delete,Session,UseInterceptors,ClassSerializerInterceptor, NotFoundException,UseGuards } from '@nestjs/common';
import {CreateUserDto} from './dtos/create-user.dto'
import { UsersService } from './users.service';
import { IsEmail } from 'class-validator';
import { UpdateUserDto } from './dtos/update-user.to';
import { Serialize } from '../interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { currentUser } from './decoratos/current-userdecorator';
// import { CurrentUserInterceptor } from './interceptors/curremt-user.interceptor';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guards';

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {

    constructor(
        private usersService:UsersService,
        private authService: AuthService
    ){}

    // @Get('/whoami')
    // whoAmI(@Session() session:any){
    //     return this.usersService.findOne(session.userId);
    // }
    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@currentUser() user:User){
        return user;
    }

    @Post('/signout')
    signOut(@Session() session:any){
        session.userId = null;
    }

    @Get('/colors/:color')
    setColor(@Param('color') color:string,@Session() session: any){
        session.color = color;
    }

    @Get('/colors')
    getColor(@Session() session:any){
        return session.color;
    }

    @Post('/signup')
    async createUser(@Body() body:CreateUserDto,@Session() session:any){
        console.log("req.body:: ",body,session);
        const user = await this.authService.signup(body.email,body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body:CreateUserDto,@Session() session:any){
        
        const user = await this.authService.signin(body.email,body.password);
        session.userId = user.id;
        return user;
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto))
    @Get('/:id')
    async findUser(@Param('id') id:string){
        const user =  await this.usersService.findOne(parseInt(id));
        if(!user){
            throw new NotFoundException('User not found')
        }
        return user;    
    }

    @Get()
    findAllUsers(@Query('email') email:string){
        return this.usersService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id:string){
        return this.usersService.remove(parseInt(id))
    }
    
    @Patch('/:id')
    UpdateUserDto(@Param('id') id:string,@Body() body:UpdateUserDto){
        return this.usersService.update(parseInt(id),body);
    }
}
