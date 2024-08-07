import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  session_id: number;

  @Column()
  first_request_id: number;

  @Column()
  last_request_id: number;

  @CreateDateColumn({ type: 'datetime', default: () => "datetime('now')" })
  dt: Date;
}
