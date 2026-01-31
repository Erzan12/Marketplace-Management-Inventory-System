import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Initialize the PG Pool
    const connectionString = `${process.env.DATABASE_URL}`;
    const pool = new Pool({ connectionString });
    
    // 2. Initialize the Prisma Adapter
    const adapter = new PrismaPg(pool);

    // 3. Pass the adapter to the parent constructor
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}