import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'responses' })
export class Response {
  @PrimaryGeneratedColumn({ name: 'response_id' })
  responseId: number;

  @Column({ name: 'request_id', nullable: false })
  requestId: number;

  @Column({ name: 'status', nullable: false })
  status: string;

  @Column({ name: 'headers', nullable: false })
  headers: string;

  @CreateDateColumn({ type: 'datetime', default: () => "datetime('now')" })
  dt: Date;

  @Column({ name: 'data', nullable: true })
  data: string;
}
