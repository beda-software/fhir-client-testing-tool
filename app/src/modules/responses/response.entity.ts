import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'responses' })
export class Response {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ name: 'request_id' })
  requestId: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'headers' })
  headers: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dt: Date;

  @Column({ name: 'data', nullable: true })
  data: string;
}
