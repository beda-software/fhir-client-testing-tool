import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Request } from '../requests/request.entity';
import { TestEntity } from '../tests/test.entity';

@Entity()
export class Session {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    target: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dt: Date;

    @OneToMany(() => Request, (request) => request.session)
    requests: Request[];

    @OneToMany(() => TestEntity, (testEntity) => testEntity.session)
    testEntities: TestEntity[];
}
