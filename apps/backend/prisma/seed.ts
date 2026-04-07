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

  type CategoryKey = 'electronics' | 'fashion' | 'lifestyle' | 'accessories';

  const priceRanges: Record<CategoryKey, number[]> = {
    electronics: [50, 500],
    fashion: [20, 150],
    lifestyle: [10, 80],
    accessories: [15, 120],
  };

  const storeByCategory: Record<CategoryKey, string> = {
    electronics: 'tech-haven',
    fashion: 'urban-carry-co',
    lifestyle: 'wellness-and-living',
    accessories: 'style-and-shades',
  };

  const templates = {
    electronics: ['Headphones', 'Keyboard', 'Mouse', 'Speaker', 'Smart Watch'],
    fashion: ['Backpack', 'Shoes', 'Hoodie', 'Jacket', 'Shorts'],
    lifestyle: ['Candle', 'Perfume', 'Diffuser', 'Yoga Mat', 'Mug'],
    accessories: ['Wallet', 'Sunglasses', 'Belt', 'Watch'],
  };

  const getImage = (name: string) => {
    return imageMap[name] || imageMap['Watch']; // fallback if not found
  };

  // 🛒 GENERATE PRODUCTS (100+)
  const products: any[] = [];

  const imageMap: Record<string, string> = {
    Headphones: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    Keyboard: 'https://images.unsplash.com/photo-1637243218672-d338945efdf7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    Mouse: 'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    Speaker: 'https://plus.unsplash.com/premium_photo-1683141496040-eeef9702269f?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Smart Watch': 'https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?q=80&w=786&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    Backpack: 'https://images.unsplash.com/photo-1551974222-1d49f576a2a4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    Shoes: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    Hoodie: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    Jacket: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    Shorts: 'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    Candle: 'https://plus.unsplash.com/premium_photo-1669824023993-273720598b14?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    Perfume: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    Diffuser: 'https://images.unsplash.com/photo-1635575066917-e788c2bd06b7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Yoga Mat': 'https://images.unsplash.com/photo-1641913640860-ab4c2bfb2bb0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    Mug: 'https://images.unsplash.com/photo-1727803633591-011b7ca44591?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    Wallet: 'https://images.unsplash.com/photo-1614330315526-166f2d71e544?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    Sunglasses: 'https://plus.unsplash.com/premium_photo-1673757119677-6445b73a405e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    Belt: 'https://images.unsplash.com/photo-1666723043169-22e29545675c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    Watch: 'https://images.unsplash.com/photo-1506193095-80bc749473f2?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  };

  (Object.entries(templates) as [CategoryKey, string[]][]).forEach(([key, items]) => {
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

          images: {
            create: [
              { url: getImage(item) }
            ]
          },

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
      images: {
        create: [
          {url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
        ]
      },
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
      images: {
        create: [
          {url: 'https://images.unsplash.com/photo-1551974222-1d49f576a2a4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
        ]
      },
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