import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedLastMonthSnapshot() {
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

seedLastMonthSnapshot()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
  })
  .finally(() => prisma.$disconnect());
