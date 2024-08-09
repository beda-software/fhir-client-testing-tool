import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ type: 'text' })
  resource_type: string;

  @Column({ type: 'text', nullable: true })
  offset: string;

  @Column({ type: 'text', nullable: true })
  count: string;

  @Column({ type: 'text', nullable: true })
  fields: string;

  @Column({ type: 'text', nullable: true })
  total: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'text', nullable: true })
  format: string;

  @Column({ type: 'text', nullable: true })
  include: string;

  @Column({ type: 'text', nullable: true })
  revinclude: string;

  @Column({ type: 'text', nullable: true })
  sort_rules: string;

  @Column({ type: 'text', nullable: true })
  filters: string;

  @Column({ type: 'text' })
  session_id: string;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'response_data', nullable: true })
  response_data: string;
}
