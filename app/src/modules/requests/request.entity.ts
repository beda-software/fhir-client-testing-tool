import { Response, Request as RequestType } from 'express';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Session } from '../sessions/session.entity';

@Entity()
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Session, (session) => session.requests)
  session: Session;

  @Column({ type: 'text' })
  requestMethod: RequestType['method'];

  @Column({ type: 'text' })
  fhirAction: string;

  @Column({ type: 'text' })
  requestUri: string;

  @Column({ type: 'text' })
  remoteAddr: string;

  @Column({ type: 'text' })
  userAgent: string;

  @Column({ type: 'text' })
  headers: string;

  @Column({ type: 'text', nullable: true })
  data: string;

  @Column({ type: 'text' })
  resourceType: string;

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
  revInclude: string;

  @Column({ type: 'text', nullable: true })
  sortRules: string;

  @Column({ type: 'text', nullable: true })
  filters: string;

  @Column({ name: 'status', type: 'smallint' })
  status: Response['statusCode'];

  @Column({ type: 'jsonb', name: 'responseData', nullable: true })
  responseData: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dt: Date;
}
