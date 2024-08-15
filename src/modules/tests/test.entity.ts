import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Session } from '../sessions/session.entity';
import { jsonbType } from 'src/utils/types';

@Entity()
export class TestEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Session, (session) => session.testEntities)
    session: Session;

    @Column({ name: 'suite_id', type: 'text' })
    suiteId: string;

    @Column({ name: 'test_result', type: 'jsonb', nullable: true })
    testResults: jsonbType;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}
