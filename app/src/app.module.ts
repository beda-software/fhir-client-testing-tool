import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestModule } from './modules/requests/request.module';
import { SessionModule } from './modules/sessions/session.module';
import { ResponseModule } from './modules/responses/response.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'myuser',
      password: 'mypassword',
      database: 'mydatabase',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    SessionModule,
    RequestModule,
    ResponseModule,
  ],
})
export class AppModule {}
