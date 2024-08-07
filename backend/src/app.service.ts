import { Injectable } from '@nestjs/common';
import { AppDataSource } from './data-source';
import { Request } from './entity/Request';

@Injectable()
export class AppService {
  getHello(): string {
    AppDataSource.initialize()
      .then(async () => {
        const user = new Request();
        await AppDataSource.manager.save(user);
        const users = await AppDataSource.manager.find(Request);
        console.log('Loaded users: ', users);
      })
      .catch((error) => console.log(error));

    return 'Hello World!';
  }
}
