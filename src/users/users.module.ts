import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule} from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeORMError } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUserInterceptor } from './interceptors/curremt-user.interceptor';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    // by doing the following any request entering our backend will all the currentUserInterceptor
    {
      provide:APP_INTERCEPTOR,
      useClass:CurrentUserInterceptor
    }
  ]
})

export class UsersModule {}
