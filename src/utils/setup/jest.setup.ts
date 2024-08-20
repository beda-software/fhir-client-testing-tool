// jest.setup.js
import { DataSource } from 'typeorm';
import { Request } from '../../modules/requests/request.entity';
import { Session } from '../../modules/sessions/session.entity';
import { TestRun } from '../../modules/test_runs/testRun.entity';

const TestDataSource = new DataSource({
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'myuser',
    password: 'mypassword',
    database: 'mydatabase',
    entities: [Request, Session, TestRun],
    synchronize: true,
    logging: false,
});

module.exports = async () => {
    await TestDataSource.initialize();
    const requestsRepository = TestDataSource.getRepository(Request);
    global.RequestsRepository = requestsRepository;
    global.TestDataSource = TestDataSource;
};
