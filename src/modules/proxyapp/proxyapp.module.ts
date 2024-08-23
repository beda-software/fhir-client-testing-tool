import { Module } from '@nestjs/common';
import { ProxyAppController } from './proxyapp.controller';
import { SessionModule } from '../sessions/session.module';
import { RequestModule } from '../requests/request.module';

@Module({
    imports: [SessionModule, RequestModule],
    controllers: [ProxyAppController],
})
export class ProxyAppModule {}
