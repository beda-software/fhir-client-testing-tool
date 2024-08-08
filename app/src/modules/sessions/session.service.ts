import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { CreateSessionDto } from './session.dto';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const session = this.sessionRepository.create(createSessionDto);
    return this.sessionRepository.save(session);
  }

  async findAll(): Promise<Session[]> {
    return this.sessionRepository.find();
  }

  async findOne(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return session;
  }

  async getTarget(id: string): Promise<Session['target']> {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return session.target;
  }

  async getProxyMiddleware(id: string) {
    const target = await this.getTarget(id);
    return createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^/sessions/${id}`]: '' },
    });
  }
}
