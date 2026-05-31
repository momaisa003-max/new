import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminEmail = "admin@example.com";
  const adminPassword = "Admin@123456";

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✅ Admin user already exists");
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin",
        password: hashedPassword,
        role: "admin",
        phone: "+1234567890",
      },
    });

    console.log("✅ Admin user created successfully");
    console.log(`   Email: ${admin.email}`);
    console.log(`   ID: ${admin.id}`);
  }

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: {
        name: "Electronics",
        slug: "electronics",
        description: "Electronic devices and gadgets",
        image: "/categories/electronics.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "clothing" },
      update: {},
      create: {
        name: "Clothing",
        slug: "clothing",
        description: "Apparel and fashion items",
        image: "/categories/clothing.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "books" },
      update: {},
      create: {
        name: "Books",
        slug: "books",
        description: "Physical and educational books",
        image: "/categories/books.jpg",
      },
    }),
  ]);

  console.log("✅ Sample categories created");

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: "wireless-headphones" },
      update: {},
      create: {
        name: "Wireless Headphones",
        slug: "wireless-headphones",
        description: "Premium noise-cancelling wireless headphones",
        price: 199.99,
        comparePrice: 299.99,
        stock: 50,
        categoryId: categories[0].id,
        featured: true,
        sku: "WH-001",
        tags: JSON.stringify(["electronics", "headphones", "audio"]),
      },
    }),
    prisma.product.upsert({
      where: { slug: "cotton-tshirt" },
      update: {},
      create: {
        name: "Cotton T-Shirt",
        slug: "cotton-tshirt",
        description: "Comfortable 100% cotton t-shirt",
        price: 29.99,
        stock: 100,
        categoryId: categories[1].id,
        featured: true,
        sku: "CT-001",
        tags: JSON.stringify(["clothing", "tshirt", "cotton"]),
      },
    }),
    prisma.product.upsert({
      where: { slug: "the-great-gatsby" },
      update: {},
      create: {
        name: "The Great Gatsby",
        slug: "the-great-gatsby",
        description: "Classic novel by F. Scott Fitzgerald",
        price: 14.99,
        stock: 75,
        categoryId: categories[2].id,
        featured: true,
        sku: "BK-001",
        tags: JSON.stringify(["books", "fiction", "classic"]),
      },
    }),
  ]);

  console.log("✅ Sample products created");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
