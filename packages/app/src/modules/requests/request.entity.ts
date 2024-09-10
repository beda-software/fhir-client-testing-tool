import { Response, Request as RequestType } from 'express';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Session } from '../sessions/session.entity';
import { jsonbType } from '../../utils/types';

@Entity()
export class Request {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Session, (session) => session.requests)
    session: Session;

    @Column({ name: 'request_method', type: 'text' })
    requestMethod: RequestType['method'];

    @Column({ name: 'fhir_action', type: 'text' })
    fhirAction: string;

    @Column({ name: 'request_uri', type: 'text' })
    requestUri: string;

    @Column({ name: 'remote_addr', type: 'text' })
    remoteAddr: string;

    @Column({ name: 'user_agent', type: 'text' })
    userAgent: string;

    @Column({ name: 'headers', type: 'jsonb' })
    headers: jsonbType;

    @Column({ name: 'data', type: 'text', nullable: true })
    data: string;

    @Column({ name: 'resource_type', type: 'text' })
    resourceType: string;

    @Column({ name: 'offset', type: 'text', nullable: true })
    offset: string;

    @Column({ name: 'count', type: 'text', nullable: true })
    count: string;

    @Column({ name: 'fields', type: 'text', nullable: true })
    fields: string;

    @Column({ name: 'total', type: 'text', nullable: true })
    total: string;

    @Column({ name: 'summary', type: 'text', nullable: true })
    summary: string;

    @Column({ name: 'format', type: 'text', nullable: true })
    format: string;

    @Column({ name: 'include', type: 'text', nullable: true })
    include: string;

    @Column({ name: 'rev_include', type: 'text', nullable: true })
    revInclude: string;

    @Column({ name: 'sort_rules', type: 'text', nullable: true })
    sortRules: string;

    @Column({ name: 'filters', type: 'jsonb', nullable: true })
    filters: jsonbType;

    @Column({ name: 'filters_codes', type: 'text', array: true, nullable: true })
    filtersCodes: string[];

    @Column({ name: 'status', type: 'smallint' })
    status: Response['statusCode'];

    @Column({ name: 'request_body', type: 'jsonb', nullable: true })
    requestBody: jsonbType;

    @Column({ name: 'response_body', type: 'jsonb', nullable: true })
    responseBody: jsonbType;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}
