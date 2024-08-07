import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_request_id: number;

  @Column()
  last_request_id: number;

  @CreateDateColumn({ type: 'datetime', default: () => "datetime('now')" })
  dt: Date;
}
