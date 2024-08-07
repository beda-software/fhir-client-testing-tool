import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Request } from './entity/Request';
import { Response } from './entity/Response';
import { Session } from './entity/Session';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'myuser',
  password: 'mypassword',
  database: 'mydatabase',
  synchronize: true,
  logging: false,
  entities: [Request, Response, Session],
  migrations: [],
  subscribers: [],
});
