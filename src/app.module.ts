import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestModule } from './modules/requests/request.module';
import { SessionModule } from './modules/sessions/session.module';
import { TestRunModule } from './modules/test_runs/testRun.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'postgres',
            port: 5432,
            username: 'myuser',
            password: 'mypassword',
            database: 'mydatabase',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            autoLoadEntities: true,
        }),
        SessionModule,
        RequestModule,
        TestRunModule,
    ],
})
export class AppModule {}
