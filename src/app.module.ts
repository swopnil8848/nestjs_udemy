import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import cookieSession from 'cookie-session'; // Corrected import
import { ConfigModule,ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:`.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>{
        console.log(`Connecting to database: ${config.get<string>('DB_NAME')}`);
        return {
          // name: 'myConnectionName',
          type:'sqlite',
          database:config.get<string>('DB_NAME'),
          synchronize:true,
          entities:[User,Report],
        }
      }
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: process.env.NODE_ENV ===  'test' ? 'test.sqlite':'db.sqlite',
    //   entities: [User, Report],
    //   // Don't use synchronize:true in production
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot(),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})

export class AppModule {
  constructor(private configServie:ConfigService){}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configServie.get('COOKIE_KEY')], // Replace this with a secure key in production
        }),
      )
      .forRoutes('*');
  }
}