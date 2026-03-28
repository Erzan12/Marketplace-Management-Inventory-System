import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  console.log('🌱 Seeding...');

  // 🧹 CLEAN DATABASE
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  // 👤 USERS
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@mystore.com',
      password: passwordHash,
      role: Role.ADMIN,
      userProfile: {
        create: {
          firstName: 'Earl',
          lastName: 'Do',
        },
      },
    },
  });

  await prisma.user.createMany({
    data: [
      { email: 'user1@test.com', password: passwordHash },
      { email: 'user2@test.com', password: passwordHash },
    ],
  });

  // 🏪 STORES
  const stores = await Promise.all([
    prisma.store.create({ data: { name: 'Urban Carry Co.', slug: 'urban-carry-co', userId: admin.id } }),
    prisma.store.create({ data: { name: 'Tech Haven', slug: 'tech-haven', userId: admin.id } }),
    prisma.store.create({ data: { name: 'Wellness & Living', slug: 'wellness-and-living', userId: admin.id } }),
    prisma.store.create({ data: { name: 'Style & Shades', slug: 'style-and-shades', userId: admin.id } }),
  ]);

  const storeMap = Object.fromEntries(stores.map(s => [s.slug, s]));

  // 📦 CATEGORIES
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Electronics', slug: 'electronics' } }),
    prisma.category.create({ data: { name: 'Fashion', slug: 'fashion' } }),
    prisma.category.create({ data: { name: 'Lifestyle', slug: 'lifestyle' } }),
    prisma.category.create({ data: { name: 'Accessories', slug: 'accessories' } }),
  ]);

  const categoryMap = Object.fromEntries(categories.map(c => [c.slug, c]));

  // 🎲 HELPERS
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const priceRanges = {
    electronics: [50, 500],
    fashion: [20, 150],
    lifestyle: [10, 80],
    accessories: [15, 120],
  };

  const storeByCategory = {
    electronics: 'tech-haven',
    fashion: 'urban-carry-co',
    lifestyle: 'wellness-and-living',
    accessories: 'style-and-shades',
  };

  const templates = {
    electronics: ['Headphones', 'Keyboard', 'Mouse', 'Speaker', 'Smart Watch'],
    fashion: ['Backpack', 'Shoes', 'Hoodie', 'Jacket', 'Shorts'],
    lifestyle: ['Candle', 'Bottle', 'Diffuser', 'Yoga Mat', 'Mug'],
    accessories: ['Wallet', 'Sunglasses', 'Belt', 'Watch'],
  };

  const getImage = (name: string) => {
    return imageMap[name] || imageMap['Watch']; // fallback if not found
  };

  // const getImage = (name: string) =>
  //   `https://source.unsplash.com/featured/?${encodeURIComponent(name)}`;

  // 🛒 GENERATE PRODUCTS (100+)
  const products: any[] = [];

  const imageMap: Record<string, string> = {
    Headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    Keyboard: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    Mouse: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    Speaker: 'https://images.unsplash.com/photo-1545454675-3531b543be5d',
    'Smart Watch': 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b',

    Backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    Shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    Hoodie: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
    Jacket: 'https://images.unsplash.com/photo-1520975922203-b1d7c2c9c4bb',
    Shorts: 'https://images.unsplash.com/photo-1593032465171-8f0c6cfa3c0f',

    Candle: 'https://images.unsplash.com/photo-1603006905003-be475563bc59',
    Bottle: 'https://images.unsplash.com/photo-1524593119773-3f8c7b0e4a47',
    Diffuser: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb',
    'Yoga Mat': 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e',
    Mug: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a',

    Wallet: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc',
    Sunglasses: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
    Belt: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
    Watch: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2',
  };

  Object.entries(templates).forEach(([key, items]) => {
    items.forEach((item) => {
      for (let i = 1; i <= 6; i++) {
        const name = `${item} ${i}`;
        const slug = `${item}-${i}`.toLowerCase();

        products.push({
          name,
          slug,
          description: `High-quality ${item.toLowerCase()}`,
          price: parseFloat(
            (
              Math.random() *
                (priceRanges[key][1] - priceRanges[key][0]) +
              priceRanges[key][0]
            ).toFixed(2)
          ),
          images: [getImage(item)],
          categoryId: categoryMap[key].id,
          storeId: storeMap[storeByCategory[key]].id,

          inventory: {
            create: {
              quantity: rand(10, 150),
            },
          },
        });
      }
    });
  });

  // ⭐ FEATURED PRODUCTS (FIXED)
  const featured = [
    {
      name: 'Premium Wireless Headphones',
      slug: 'premium-headphones',
      description: 'Noise-canceling headphones',
      price: 199.99,
      // quantity: 50,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e'],
      categoryId: categoryMap.electronics.id,
      storeId: storeMap['tech-haven'].id,
      inventory: {
        create: {
          quantity: rand(10, 150),
        },
      },
    },
    {
      name: 'Minimalist Backpack',
      slug: 'minimalist-backpack',
      description: 'Water-resistant backpack',
      price: 89.99,
      // quantity: 100,
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62'],
      categoryId: categoryMap.fashion.id,
      storeId: storeMap['urban-carry-co'].id,
      inventory: {
        create: {
          quantity: rand(10, 150),
        },
      },
    },
  ];

  // 💾 INSERT
  // await prisma.product.createMany({
  //   data: [...featured, ...products],
  // });
  await Promise.all(
    [...featured, ...products].map((product) =>
      prisma.product.create({ data: product })
    )
  );

  console.log(`✅ Seeded ${products.length + featured.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });