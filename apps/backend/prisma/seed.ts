import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';


const pool = new Pool ({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  //seed users
  const  passwordHash = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com'},
    update: {},
    create: {
      email: 'admin@example.com',
      password: passwordHash,
      role: Role.admin
    },
  });

  const users = await prisma.user.createMany({
    data: [
      {
        email: 'user1@example.com',
        password: passwordHash,
        role: Role.user
      },
      {
        email: 'user2@example.com',
        password: passwordHash,
        role: Role.user
      },
      {
        email: 'user3@example.com',
        password: passwordHash,
        role: Role.user
      }
    ],
    skipDuplicates: true,
  });

  console.log('Seedings Users completed');
  console.log(admin, users)
  // Simulate a total value of 62 million last month
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  lastMonthDate.setDate(28); // End of the month snapshot (or pick a fixed date)

  await prisma.inventorySnapshot.create({
    data: {
        month: "2025-05",
        totalValue: 62000000,
        createdAt: lastMonthDate,
    },
  });

  console.log('✅ Seeded last month\'s inventory snapshot.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
  
