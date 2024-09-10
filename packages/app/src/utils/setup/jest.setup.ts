import { DataSource } from 'typeorm';
import { Request } from '../../modules/requests/request.entity';
import { Session } from '../../modules/sessions/session.entity';
import { TestRun } from '../../modules/test_runs/testRun.entity';

const TestDataSource = new DataSource({
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
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
