import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  request_method: string;

  @Column({ type: 'text', nullable: false })
  fhir_action: string;

  @Column({ type: 'text', nullable: false })
  request_uri: string;

  @Column({ type: 'text', nullable: false })
  remote_addr: string;

  @Column({ type: 'text', nullable: false })
  user_agent: string;

  @Column({ type: 'text', nullable: false })
  headers: string;

  @CreateDateColumn({ type: 'datetime', default: () => "datetime('now')" })
  dt: Date;

  @Column({ type: 'text', nullable: true })
  data: string;
}
