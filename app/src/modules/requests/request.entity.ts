import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'text' })
  request_method: string;

  @Column({ type: 'text' })
  fhir_action: string;

  @Column({ type: 'text' })
  request_uri: string;

  @Column({ type: 'text' })
  remote_addr: string;

  @Column({ type: 'text' })
  user_agent: string;

  @Column({ type: 'text' })
  headers: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dt: Date;

  @Column({ type: 'text', nullable: true })
  data: string;
}
