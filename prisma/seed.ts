import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: { name: "Electronics", slug: "electronics" },
    }),
    prisma.category.upsert({
      where: { slug: "clothing" },
      update: {},
      create: { name: "Clothing", slug: "clothing" },
    }),
    prisma.category.upsert({
      where: { slug: "handmade" },
      update: {},
      create: { name: "Handmade", slug: "handmade" },
    }),
    prisma.category.upsert({
      where: { slug: "books" },
      update: {},
      create: { name: "Books", slug: "books" },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Test users
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@test.com" },
    update: {},
    create: {
      name: "Test Buyer",
      email: "buyer@test.com",
      password: "password123",
      role: "BUYER",
    },
  });

  const vendor = await prisma.user.upsert({
    where: { email: "vendor@test.com" },
    update: {},
    create: {
      name: "Test Vendor",
      email: "vendor@test.com",
      password: "password123",
      role: "VENDOR",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      name: "Test Admin",
      email: "admin@test.com",
      password: "password123",
      role: "ADMIN",
    },
  });

  console.log("✅ Created test users:");
  console.log("   buyer@test.com  / password123");
  console.log("   vendor@test.com / password123");
  console.log("   admin@test.com  / password123");

  // Sample products from vendor
  const electronics = categories.find((c) => c.slug === "electronics")!;

  await prisma.product.upsert({
    where: { slug: "wireless-headphones-pro" },
    update: {},
    create: {
      title: "Wireless Headphones Pro",
      slug: "wireless-headphones-pro",
      description:
        "Premium wireless headphones with noise cancellation and 30-hour battery life.",
      price: 149.99,
      images: [],
      status: "ACTIVE",
      categoryId: electronics.id,
      vendorId: vendor.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "smart-watch-x1" },
    update: {},
    create: {
      title: "Smart Watch X1",
      slug: "smart-watch-x1",
      description: "Feature-packed smartwatch with health tracking and GPS.",
      price: 299.99,
      images: [],
      status: "ACTIVE",
      categoryId: electronics.id,
      vendorId: vendor.id,
    },
  });

  console.log("✅ Created sample products");
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
