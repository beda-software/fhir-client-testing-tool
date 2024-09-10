import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestModule } from './modules/requests/request.module';
import { SessionModule } from './modules/sessions/session.module';
import { TestRunModule } from './modules/test_runs/testRun.module';
import { ConfigModule } from '@nestjs/config';
import { ProxyAppModule } from './modules/proxyapp/proxyapp.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'postgres',
            port: 5432,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            autoLoadEntities: true,
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        SessionModule,
        RequestModule,
        TestRunModule,
        ProxyAppModule,
    ],
})
export class AppModule {}
