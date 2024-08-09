import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Request } from '../requests/request.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  target: string;

  @Column({ nullable: true })
  first_request_id: number;

  @Column({ nullable: true })
  last_request_id: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dt: Date;

  @OneToMany(() => Request, (request) => request.session_id)
  requests: Request[];
}
