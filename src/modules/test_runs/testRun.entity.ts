import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Session } from '../sessions/session.entity';
import { jsonbType } from 'src/utils/types';

export enum TestRunStatus {
    NOT_STARTED = 'not-started',
    RUNNING = 'running',
    COMPLETED = 'completed',
    FAILED = 'failed',
}
@Entity()
export class TestRun {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'status', type: 'enum', enum: TestRunStatus, default: TestRunStatus.NOT_STARTED })
    status: 'not-started' | 'running' | 'completed' | 'failed';

    @ManyToOne(() => Session, (session) => session.testEntities)
    session: Session;

    @Column({ name: 'suite_id', type: 'text' })
    suiteId: string;

    @Column({ name: 'suite_total', type: 'smallint', nullable: true })
    suiteTotal: number;

    @Column({ name: 'suite_passed', type: 'smallint', nullable: true })
    suitePassed: number;

    @Column({ name: 'test_result', type: 'jsonb', nullable: true })
    testResults: jsonbType;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}
