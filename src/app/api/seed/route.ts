import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Clear existing data
    await db.cartItem.deleteMany();
    await db.cart.deleteMany();
    await db.orderItem.deleteMany();
    await db.order.deleteMany();
    await db.review.deleteMany();
    await db.address.deleteMany();
    await db.product.deleteMany();
    await db.category.deleteMany();
    await db.user.deleteMany();

    // Create admin user
    const admin = await db.user.create({
      data: {
        email: 'admin@allshop.com',
        name: 'Admin',
        password: 'admin123',
        role: 'admin',
      },
    });

    // Create sample customers
    const customer1 = await db.user.create({
      data: {
        email: 'john@example.com',
        name: 'John Smith',
        password: 'password123',
        role: 'customer',
        phone: '+1-555-0101',
      },
    });

    const customer2 = await db.user.create({
      data: {
        email: 'sarah@example.com',
        name: 'Sarah Johnson',
        password: 'password123',
        role: 'customer',
        phone: '+1-555-0102',
      },
    });

    const customer3 = await db.user.create({
      data: {
        email: 'mike@example.com',
        name: 'Mike Wilson',
        password: 'password123',
        role: 'customer',
        phone: '+1-555-0103',
      },
    });

    // Create categories
    const electronics = await db.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and tech essentials',
        image: 'https://picsum.photos/seed/electronics/600/600',
      },
    });

    const clothing = await db.category.create({
      data: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion for every occasion',
        image: 'https://picsum.photos/seed/clothing/600/600',
      },
    });

    const homeKitchen = await db.category.create({
      data: {
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        description: 'Everything for your home',
        image: 'https://picsum.photos/seed/home-kitchen/600/600',
      },
    });

    const books = await db.category.create({
      data: {
        name: 'Books',
        slug: 'books',
        description: 'Knowledge and entertainment',
        image: 'https://picsum.photos/seed/books/600/600',
      },
    });

    const sports = await db.category.create({
      data: {
        name: 'Sports',
        slug: 'sports',
        description: 'Gear up for any sport',
        image: 'https://picsum.photos/seed/sports/600/600',
      },
    });

    const beauty = await db.category.create({
      data: {
        name: 'Beauty',
        slug: 'beauty',
        description: 'Skincare, makeup, and more',
        image: 'https://picsum.photos/seed/beauty/600/600',
      },
    });

    // Create products
    const productsData = [
      // Electronics
      {
        name: 'MacBook Pro 16"',
        slug: 'macbook-pro-16',
        description: 'Apple MacBook Pro with M3 Pro chip, 18GB RAM, 512GB SSD. The most powerful MacBook ever with stunning Liquid Retina XDR display.',
        price: 2499.99,
        comparePrice: 2799.99,
        categoryId: electronics.id,
        stock: 25,
        featured: true,
        sku: 'ELEC-001',
        images: JSON.stringify([
          'https://picsum.photos/seed/macbook-pro-16/600/600',
          'https://picsum.photos/seed/macbook-pro-16-2/600/600',
          'https://picsum.photos/seed/macbook-pro-16-3/600/600',
        ]),
        tags: JSON.stringify(['laptop', 'apple', 'macbook', 'premium']),
      },
      {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'iPhone 15 Pro with A17 Pro chip, titanium design, 48MP camera system, and USB-C. Available in Natural Titanium.',
        price: 999.99,
        comparePrice: 1099.99,
        categoryId: electronics.id,
        stock: 50,
        featured: true,
        sku: 'ELEC-002',
        images: JSON.stringify([
          'https://picsum.photos/seed/iphone-15-pro/600/600',
          'https://picsum.photos/seed/iphone-15-pro-2/600/600',
          'https://picsum.photos/seed/iphone-15-pro-3/600/600',
        ]),
        tags: JSON.stringify(['phone', 'apple', 'iphone', '5g']),
      },
      {
        name: 'Samsung 65" OLED TV',
        slug: 'samsung-65-oled-tv',
        description: 'Samsung 65-inch S95C OLED 4K Smart TV with Dolby Atmos and Object Tracking Sound. Stunning picture quality with infinite contrast.',
        price: 1799.99,
        comparePrice: 2199.99,
        categoryId: electronics.id,
        stock: 15,
        featured: true,
        sku: 'ELEC-003',
        images: JSON.stringify([
          'https://picsum.photos/seed/samsung-tv/600/600',
          'https://picsum.photos/seed/samsung-tv-2/600/600',
        ]),
        tags: JSON.stringify(['tv', 'samsung', 'oled', '4k']),
      },
      {
        name: 'AirPods Pro 2',
        slug: 'airpods-pro-2',
        description: 'Apple AirPods Pro 2nd generation with USB-C, Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio.',
        price: 249.99,
        comparePrice: 279.99,
        categoryId: electronics.id,
        stock: 100,
        featured: false,
        sku: 'ELEC-004',
        images: JSON.stringify([
          'https://picsum.photos/seed/airpods-pro/600/600',
          'https://picsum.photos/seed/airpods-pro-2/600/600',
        ]),
        tags: JSON.stringify(['earbuds', 'apple', 'wireless', 'anc']),
      },
      {
        name: 'iPad Air',
        slug: 'ipad-air',
        description: 'Apple iPad Air with M1 chip, 10.9-inch Liquid Retina display, 64GB storage. Perfect for work and play.',
        price: 599.99,
        comparePrice: 649.99,
        categoryId: electronics.id,
        stock: 40,
        featured: false,
        sku: 'ELEC-005',
        images: JSON.stringify([
          'https://picsum.photos/seed/ipad-air/600/600',
          'https://picsum.photos/seed/ipad-air-2/600/600',
          'https://picsum.photos/seed/ipad-air-3/600/600',
        ]),
        tags: JSON.stringify(['tablet', 'apple', 'ipad']),
      },
      {
        name: 'Sony Alpha A7 IV Camera',
        slug: 'sony-alpha-a7-iv',
        description: 'Sony Alpha 7 IV full-frame mirrorless camera with 33MP sensor, 4K 60fps video, and advanced autofocus system.',
        price: 2498.00,
        comparePrice: 2698.00,
        categoryId: electronics.id,
        stock: 12,
        featured: true,
        sku: 'ELEC-006',
        images: JSON.stringify([
          'https://picsum.photos/seed/sony-camera/600/600',
          'https://picsum.photos/seed/sony-camera-2/600/600',
        ]),
        tags: JSON.stringify(['camera', 'sony', 'mirrorless', 'photography']),
      },
      {
        name: 'DJI Mini 4 Pro Drone',
        slug: 'dji-mini-4-pro',
        description: 'DJI Mini 4 Pro compact drone with 4K/60fps HDR video, 48MP photos, and 34-minute flight time. Under 249g.',
        price: 759.00,
        comparePrice: 829.00,
        categoryId: electronics.id,
        stock: 20,
        featured: false,
        sku: 'ELEC-007',
        images: JSON.stringify([
          'https://picsum.photos/seed/dji-drone/600/600',
          'https://picsum.photos/seed/dji-drone-2/600/600',
        ]),
        tags: JSON.stringify(['drone', 'dji', 'aerial', '4k']),
      },
      {
        name: 'Apple Watch Ultra 2',
        slug: 'apple-watch-ultra-2',
        description: 'Apple Watch Ultra 2 with S9 chip, 49mm titanium case, precision dual-frequency GPS, and up to 36 hours of battery life.',
        price: 799.99,
        comparePrice: null,
        categoryId: electronics.id,
        stock: 30,
        featured: true,
        sku: 'ELEC-008',
        images: JSON.stringify([
          'https://picsum.photos/seed/apple-watch/600/600',
          'https://picsum.photos/seed/apple-watch-2/600/600',
        ]),
        tags: JSON.stringify(['smartwatch', 'apple', 'fitness', 'gps']),
      },
      // Clothing
      {
        name: 'Classic Leather Jacket',
        slug: 'classic-leather-jacket',
        description: 'Premium genuine leather jacket with quilted lining. Classic design that never goes out of style. Available in Black.',
        price: 199.99,
        comparePrice: 299.99,
        categoryId: clothing.id,
        stock: 35,
        featured: true,
        sku: 'CLOTH-001',
        images: JSON.stringify([
          'https://picsum.photos/seed/leather-jacket/600/600',
          'https://picsum.photos/seed/leather-jacket-2/600/600',
          'https://picsum.photos/seed/leather-jacket-3/600/600',
        ]),
        tags: JSON.stringify(['jacket', 'leather', 'outerwear', 'premium']),
      },
      {
        name: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        description: 'Nike Air Max 270 sneakers with visible Max Air unit for all-day comfort. Lightweight and breathable mesh upper.',
        price: 150.00,
        comparePrice: 170.00,
        categoryId: clothing.id,
        stock: 60,
        featured: false,
        sku: 'CLOTH-002',
        images: JSON.stringify([
          'https://picsum.photos/seed/nike-airmax/600/600',
          'https://picsum.photos/seed/nike-airmax-2/600/600',
        ]),
        tags: JSON.stringify(['sneakers', 'nike', 'shoes', 'running']),
      },
      {
        name: 'Premium Cotton T-Shirt',
        slug: 'premium-cotton-tshirt',
        description: 'Ultra-soft 100% organic cotton t-shirt with a modern relaxed fit. Pre-shrunk and machine washable.',
        price: 29.99,
        comparePrice: 39.99,
        categoryId: clothing.id,
        stock: 200,
        featured: false,
        sku: 'CLOTH-003',
        images: JSON.stringify([
          'https://picsum.photos/seed/cotton-tshirt/600/600',
          'https://picsum.photos/seed/cotton-tshirt-2/600/600',
        ]),
        tags: JSON.stringify(['tshirt', 'cotton', 'basics', 'organic']),
      },
      {
        name: 'Slim Fit Denim Jeans',
        slug: 'slim-fit-denim-jeans',
        description: 'Classic slim fit jeans crafted from premium stretch denim. Comfortable all-day wear with a modern silhouette.',
        price: 79.99,
        comparePrice: 99.99,
        categoryId: clothing.id,
        stock: 80,
        featured: false,
        sku: 'CLOTH-004',
        images: JSON.stringify([
          'https://picsum.photos/seed/denim-jeans/600/600',
          'https://picsum.photos/seed/denim-jeans-2/600/600',
          'https://picsum.photos/seed/denim-jeans-3/600/600',
        ]),
        tags: JSON.stringify(['jeans', 'denim', 'slim-fit', 'pants']),
      },
      {
        name: 'Elegant Silk Dress',
        slug: 'elegant-silk-dress',
        description: 'Stunning silk dress with flowing silhouette, perfect for evening events. Features delicate pleating and adjustable waist tie.',
        price: 189.99,
        comparePrice: 249.99,
        categoryId: clothing.id,
        stock: 25,
        featured: true,
        sku: 'CLOTH-005',
        images: JSON.stringify([
          'https://picsum.photos/seed/silk-dress/600/600',
          'https://picsum.photos/seed/silk-dress-2/600/600',
        ]),
        tags: JSON.stringify(['dress', 'silk', 'evening', 'elegant']),
      },
      {
        name: 'Wool Blend Overcoat',
        slug: 'wool-blend-overcoat',
        description: 'Tailored wool blend overcoat with notch lapels and two-button closure. Perfect for the colder months.',
        price: 249.99,
        comparePrice: 349.99,
        categoryId: clothing.id,
        stock: 20,
        featured: false,
        sku: 'CLOTH-006',
        images: JSON.stringify([
          'https://picsum.photos/seed/wool-overcoat/600/600',
          'https://picsum.photos/seed/wool-overcoat-2/600/600',
        ]),
        tags: JSON.stringify(['coat', 'wool', 'winter', 'formal']),
      },
      // Home & Kitchen
      {
        name: 'Breville Barista Express',
        slug: 'breville-barista-express',
        description: 'Breville Barista Express espresso machine with built-in conical burr grinder. From bean to espresso in under a minute.',
        price: 699.99,
        comparePrice: 799.99,
        categoryId: homeKitchen.id,
        stock: 18,
        featured: true,
        sku: 'HOME-001',
        images: JSON.stringify([
          'https://picsum.photos/seed/espresso-machine/600/600',
          'https://picsum.photos/seed/espresso-machine-2/600/600',
          'https://picsum.photos/seed/espresso-machine-3/600/600',
        ]),
        tags: JSON.stringify(['coffee', 'espresso', 'kitchen', 'appliance']),
      },
      {
        name: 'Ninja Air Fryer XL',
        slug: 'ninja-air-fryer-xl',
        description: 'Ninja Air Fryer XL with 5.5-quart capacity. Fry, roast, bake, and reheat with up to 75% less fat than traditional frying.',
        price: 129.99,
        comparePrice: 179.99,
        categoryId: homeKitchen.id,
        stock: 45,
        featured: false,
        sku: 'HOME-002',
        images: JSON.stringify([
          'https://picsum.photos/seed/air-fryer/600/600',
          'https://picsum.photos/seed/air-fryer-2/600/600',
        ]),
        tags: JSON.stringify(['air-fryer', 'kitchen', 'appliance', 'cooking']),
      },
      {
        name: 'Vitamix Blender Pro',
        slug: 'vitamix-blender-pro',
        description: 'Vitamix Professional-Series blender with 2.2 HP motor, variable speed control, and self-cleaning technology.',
        price: 449.99,
        comparePrice: 529.99,
        categoryId: homeKitchen.id,
        stock: 22,
        featured: false,
        sku: 'HOME-003',
        images: JSON.stringify([
          'https://picsum.photos/seed/vitamix-blender/600/600',
          'https://picsum.photos/seed/vitamix-blender-2/600/600',
        ]),
        tags: JSON.stringify(['blender', 'kitchen', 'vitamix', 'smoothie']),
      },
      {
        name: 'Dyson V15 Detect Vacuum',
        slug: 'dyson-v15-detect',
        description: 'Dyson V15 Detect cordless vacuum with laser dust detection, LCD screen showing dust count, and up to 60 minutes of runtime.',
        price: 749.99,
        comparePrice: 849.99,
        categoryId: homeKitchen.id,
        stock: 15,
        featured: true,
        sku: 'HOME-004',
        images: JSON.stringify([
          'https://picsum.photos/seed/dyson-vacuum/600/600',
          'https://picsum.photos/seed/dyson-vacuum-2/600/600',
          'https://picsum.photos/seed/dyson-vacuum-3/600/600',
        ]),
        tags: JSON.stringify(['vacuum', 'dyson', 'cordless', 'cleaning']),
      },
      {
        name: 'KitchenAid Stand Mixer',
        slug: 'kitchenaid-stand-mixer',
        description: 'KitchenAid Artisan Series 5-quart stand mixer with 10 speeds and planetary mixing action. Includes flat beater, dough hook, and wire whip.',
        price: 379.99,
        comparePrice: 449.99,
        categoryId: homeKitchen.id,
        stock: 30,
        featured: false,
        sku: 'HOME-005',
        images: JSON.stringify([
          'https://picsum.photos/seed/kitchenaid-mixer/600/600',
          'https://picsum.photos/seed/kitchenaid-mixer-2/600/600',
        ]),
        tags: JSON.stringify(['mixer', 'kitchen', 'kitchenaid', 'baking']),
      },
      {
        name: 'Instant Pot Duo Plus',
        slug: 'instant-pot-duo-plus',
        description: 'Instant Pot Duo Plus 6-quart 9-in-1 electric pressure cooker. Pressure cook, slow cook, rice cooker, steamer, sauté, and more.',
        price: 99.99,
        comparePrice: 129.99,
        categoryId: homeKitchen.id,
        stock: 55,
        featured: false,
        sku: 'HOME-006',
        images: JSON.stringify([
          'https://picsum.photos/seed/instant-pot/600/600',
          'https://picsum.photos/seed/instant-pot-2/600/600',
        ]),
        tags: JSON.stringify(['pressure-cooker', 'kitchen', 'instant-pot', 'cooking']),
      },
      // Books
      {
        name: 'Atomic Habits',
        slug: 'atomic-habits',
        description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear. The #1 New York Times bestseller with over 10 million copies sold.',
        price: 16.99,
        comparePrice: 27.00,
        categoryId: books.id,
        stock: 150,
        featured: true,
        sku: 'BOOK-001',
        images: JSON.stringify([
          'https://picsum.photos/seed/atomic-habits/600/600',
          'https://picsum.photos/seed/atomic-habits-2/600/600',
        ]),
        tags: JSON.stringify(['self-help', 'habits', 'productivity', 'bestseller']),
      },
      {
        name: 'Clean Code',
        slug: 'clean-code',
        description: 'Clean Code: A Handbook of Agile Software Craftsmanship by Robert C. Martin. Essential reading for every developer.',
        price: 39.99,
        comparePrice: 49.99,
        categoryId: books.id,
        stock: 75,
        featured: false,
        sku: 'BOOK-002',
        images: JSON.stringify([
          'https://picsum.photos/seed/clean-code/600/600',
          'https://picsum.photos/seed/clean-code-2/600/600',
        ]),
        tags: JSON.stringify(['programming', 'software', 'clean-code', 'agile']),
      },
      {
        name: 'The Great Gatsby',
        slug: 'the-great-gatsby',
        description: 'F. Scott Fitzgerald\'s masterpiece. A portrait of the Jazz Age in all its decadence and excess. Deluxe edition with forward by novelist Penelope Fitzgerald.',
        price: 12.99,
        comparePrice: 15.99,
        categoryId: books.id,
        stock: 120,
        featured: false,
        sku: 'BOOK-003',
        images: JSON.stringify([
          'https://picsum.photos/seed/great-gatsby/600/600',
        ]),
        tags: JSON.stringify(['fiction', 'classic', 'literature']),
      },
      {
        name: 'Sapiens: A Brief History',
        slug: 'sapiens-brief-history',
        description: 'Sapiens: A Brief History of Humankind by Yuval Noah Harari. A groundbreaking narrative of humanity\'s creation and evolution.',
        price: 18.99,
        comparePrice: 24.99,
        categoryId: books.id,
        stock: 90,
        featured: false,
        sku: 'BOOK-004',
        images: JSON.stringify([
          'https://picsum.photos/seed/sapiens-book/600/600',
          'https://picsum.photos/seed/sapiens-book-2/600/600',
        ]),
        tags: JSON.stringify(['non-fiction', 'history', 'science', 'bestseller']),
      },
      {
        name: 'Designing Data-Intensive Applications',
        slug: 'designing-data-intensive-apps',
        description: 'Designing Data-Intensive Applications by Martin Kleppmann. The big ideas behind reliable, scalable, and maintainable systems.',
        price: 45.99,
        comparePrice: 59.99,
        categoryId: books.id,
        stock: 40,
        featured: true,
        sku: 'BOOK-005',
        images: JSON.stringify([
          'https://picsum.photos/seed/data-intensive/600/600',
        ]),
        tags: JSON.stringify(['programming', 'database', 'architecture', 'distributed']),
      },
      // Sports
      {
        name: 'Nike Running Shoes Pegasus 40',
        slug: 'nike-pegasus-40',
        description: 'Nike Pegasus 40 running shoes with React foam technology for a smooth, responsive ride. Breathable mesh upper with Flywire cables.',
        price: 130.00,
        comparePrice: 140.00,
        categoryId: sports.id,
        stock: 70,
        featured: false,
        sku: 'SPORT-001',
        images: JSON.stringify([
          'https://picsum.photos/seed/nike-pegasus/600/600',
          'https://picsum.photos/seed/nike-pegasus-2/600/600',
          'https://picsum.photos/seed/nike-pegasus-3/600/600',
        ]),
        tags: JSON.stringify(['running', 'shoes', 'nike', 'fitness']),
      },
      {
        name: 'Premium Yoga Mat',
        slug: 'premium-yoga-mat',
        description: 'Extra thick 6mm non-slip yoga mat with alignment lines. Eco-friendly TPE material, includes carrying strap.',
        price: 49.99,
        comparePrice: 69.99,
        categoryId: sports.id,
        stock: 100,
        featured: false,
        sku: 'SPORT-002',
        images: JSON.stringify([
          'https://picsum.photos/seed/yoga-mat/600/600',
          'https://picsum.photos/seed/yoga-mat-2/600/600',
        ]),
        tags: JSON.stringify(['yoga', 'mat', 'fitness', 'exercise']),
      },
      {
        name: 'Adjustable Dumbbell Set',
        slug: 'adjustable-dumbbell-set',
        description: 'Adjustable dumbbell set from 5 to 52.5 lbs each. Quick-change weight system with durable steel construction.',
        price: 349.99,
        comparePrice: 449.99,
        categoryId: sports.id,
        stock: 20,
        featured: true,
        sku: 'SPORT-003',
        images: JSON.stringify([
          'https://picsum.photos/seed/dumbbell-set/600/600',
          'https://picsum.photos/seed/dumbbell-set-2/600/600',
        ]),
        tags: JSON.stringify(['dumbbell', 'weights', 'strength', 'home-gym']),
      },
      {
        name: 'Mountain Bike Pro',
        slug: 'mountain-bike-pro',
        description: 'Professional-grade mountain bike with full suspension, 29-inch wheels, and 21-speed Shimano drivetrain. Built for trails and adventure.',
        price: 899.99,
        comparePrice: 1199.99,
        categoryId: sports.id,
        stock: 8,
        featured: true,
        sku: 'SPORT-004',
        images: JSON.stringify([
          'https://picsum.photos/seed/mountain-bike/600/600',
          'https://picsum.photos/seed/mountain-bike-2/600/600',
          'https://picsum.photos/seed/mountain-bike-3/600/600',
        ]),
        tags: JSON.stringify(['bike', 'mountain', 'cycling', 'outdoor']),
      },
      {
        name: 'Resistance Band Set',
        slug: 'resistance-band-set',
        description: 'Complete resistance band set with 5 levels of resistance, door anchor, handles, and ankle straps. Perfect for home workouts.',
        price: 29.99,
        comparePrice: 44.99,
        categoryId: sports.id,
        stock: 150,
        featured: false,
        sku: 'SPORT-005',
        images: JSON.stringify([
          'https://picsum.photos/seed/resistance-bands/600/600',
        ]),
        tags: JSON.stringify(['bands', 'resistance', 'fitness', 'home-workout']),
      },
      {
        name: 'Tennis Racket Carbon Pro',
        slug: 'tennis-racket-carbon-pro',
        description: 'Professional carbon fiber tennis racket with vibration dampening technology. Lightweight at 10.6 oz with 100 sq in head.',
        price: 179.99,
        comparePrice: 229.99,
        categoryId: sports.id,
        stock: 25,
        featured: false,
        sku: 'SPORT-006',
        images: JSON.stringify([
          'https://picsum.photos/seed/tennis-racket/600/600',
          'https://picsum.photos/seed/tennis-racket-2/600/600',
        ]),
        tags: JSON.stringify(['tennis', 'racket', 'racquet', 'sports']),
      },
      // Beauty
      {
        name: 'Luxury Face Moisturizer',
        slug: 'luxury-face-moisturizer',
        description: 'Premium hyaluronic acid moisturizer with vitamin C and retinol. Deep hydration for all skin types. Dermatologist recommended.',
        price: 59.99,
        comparePrice: 79.99,
        categoryId: beauty.id,
        stock: 80,
        featured: true,
        sku: 'BEAUTY-001',
        images: JSON.stringify([
          'https://picsum.photos/seed/moisturizer/600/600',
          'https://picsum.photos/seed/moisturizer-2/600/600',
        ]),
        tags: JSON.stringify(['skincare', 'moisturizer', 'hyaluronic', 'face']),
      },
      {
        name: 'Designer Perfume Collection',
        slug: 'designer-perfume-collection',
        description: 'Exclusive designer perfume set featuring 3 signature scents in 50ml bottles. Long-lasting fragrances with elegant packaging.',
        price: 129.99,
        comparePrice: 189.99,
        categoryId: beauty.id,
        stock: 35,
        featured: false,
        sku: 'BEAUTY-002',
        images: JSON.stringify([
          'https://picsum.photos/seed/perfume-set/600/600',
          'https://picsum.photos/seed/perfume-set-2/600/600',
          'https://picsum.photos/seed/perfume-set-3/600/600',
        ]),
        tags: JSON.stringify(['perfume', 'fragrance', 'gift', 'luxury']),
      },
      {
        name: 'Professional Makeup Kit',
        slug: 'professional-makeup-kit',
        description: 'Complete professional makeup kit with 42 colors eyeshadow palette, foundation, concealer, brushes, and more. Perfect for beginners and pros.',
        price: 89.99,
        comparePrice: 129.99,
        categoryId: beauty.id,
        stock: 45,
        featured: false,
        sku: 'BEAUTY-003',
        images: JSON.stringify([
          'https://picsum.photos/seed/makeup-kit/600/600',
          'https://picsum.photos/seed/makeup-kit-2/600/600',
        ]),
        tags: JSON.stringify(['makeup', 'cosmetics', 'palette', 'beauty']),
      },
      {
        name: 'Hair Care Set Premium',
        slug: 'hair-care-set-premium',
        description: 'Premium hair care set with argan oil shampoo, conditioner, and leave-in treatment. Sulfate-free formula for all hair types.',
        price: 49.99,
        comparePrice: 69.99,
        categoryId: beauty.id,
        stock: 60,
        featured: false,
        sku: 'BEAUTY-004',
        images: JSON.stringify([
          'https://picsum.photos/seed/hair-care/600/600',
        ]),
        tags: JSON.stringify(['hair', 'shampoo', 'conditioner', 'argan']),
      },
      {
        name: 'Vitamin C Serum',
        slug: 'vitamin-c-serum',
        description: 'Professional strength 20% Vitamin C serum with hyaluronic acid and vitamin E. Brightens skin, reduces dark spots and fine lines.',
        price: 34.99,
        comparePrice: 49.99,
        categoryId: beauty.id,
        stock: 95,
        featured: true,
        sku: 'BEAUTY-005',
        images: JSON.stringify([
          'https://picsum.photos/seed/vitamin-c-serum/600/600',
          'https://picsum.photos/seed/vitamin-c-serum-2/600/600',
        ]),
        tags: JSON.stringify(['serum', 'vitamin-c', 'skincare', 'brightening']),
      },
    ];

    const createdProducts = [];
    for (const productData of productsData) {
      const product = await db.product.create({ data: productData });
      createdProducts.push(product);
    }

    // Create sample reviews
    const reviewData = [
      { userId: customer1.id, productId: createdProducts[0].id, rating: 5, title: 'Best laptop ever!', comment: 'The M3 Pro chip is incredibly fast. Best laptop I have ever owned. The display is stunning and battery life is amazing.' },
      { userId: customer2.id, productId: createdProducts[0].id, rating: 4, title: 'Great but expensive', comment: 'Amazing performance and build quality. Wish it was a bit more affordable but you get what you pay for.' },
      { userId: customer3.id, productId: createdProducts[1].id, rating: 5, title: 'Incredible phone!', comment: 'The camera system is outstanding. Titanium feels premium. USB-C is finally here!' },
      { userId: customer1.id, productId: createdProducts[1].id, rating: 4, title: 'Solid upgrade', comment: 'Upgraded from iPhone 13 Pro. The improvements are noticeable especially in camera and speed.' },
      { userId: customer2.id, productId: createdProducts[8].id, rating: 5, title: 'Gorgeous dress!', comment: 'The silk quality is exceptional. Fits perfectly and the pleating detail is beautiful. Got so many compliments!' },
      { userId: customer3.id, productId: createdProducts[12].id, rating: 5, title: 'Best coffee maker!', comment: 'Makes the perfect espresso every time. The built-in grinder is a game changer. Worth every penny.' },
      { userId: customer1.id, productId: createdProducts[15].id, rating: 4, title: 'Life changing vacuum', comment: 'The laser dust detection is not a gimmick - it actually works! Great suction power and battery life.' },
      { userId: customer2.id, productId: createdProducts[20].id, rating: 5, title: 'Must read!', comment: 'This book completely changed how I think about habits. Practical advice that actually works.' },
      { userId: customer3.id, productId: createdProducts[21].id, rating: 5, title: 'Essential for developers', comment: 'Every programmer should read this. Clear examples and timeless principles for writing better code.' },
      { userId: customer1.id, productId: createdProducts[25].id, rating: 5, title: 'Great for home gym', comment: 'Quick to change weights and feels very solid. Saves so much space compared to a full dumbbell rack.' },
      { userId: customer2.id, productId: createdProducts[30].id, rating: 4, title: 'Great skincare', comment: 'My skin feels so much better after using this for 2 weeks. The hyaluronic acid really makes a difference.' },
      { userId: customer3.id, productId: createdProducts[34].id, rating: 5, title: 'Visible results!', comment: 'Dark spots are fading after just 3 weeks. My skin looks brighter and more even. Highly recommend!' },
    ];

    for (const review of reviewData) {
      await db.review.create({ data: review });
    }

    // Update product ratings based on reviews
    for (const product of createdProducts) {
      const reviews = await db.review.findMany({
        where: { productId: product.id },
        select: { rating: true },
      });
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await db.product.update({
          where: { id: product.id },
          data: {
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews.length,
          },
        });
      }
    }

    // Create a sample order for customer1
    const order = await db.order.create({
      data: {
        userId: customer1.id,
        subtotal: 2549.98,
        tax: 204.00,
        shipping: 0,
        total: 2753.98,
        shippingAddress: JSON.stringify({
          name: 'John Smith',
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US',
          phone: '+1-555-0101',
        }),
        paymentMethod: 'card',
        paymentStatus: 'paid',
        status: 'delivered',
        items: {
          create: [
            { productId: createdProducts[0].id, quantity: 1, price: 2499.99 },
            { productId: createdProducts[3].id, quantity: 1, price: 249.99 },
          ],
        },
      },
    });

    // Create another sample order
    const order2 = await db.order.create({
      data: {
        userId: customer2.id,
        subtotal: 419.98,
        tax: 33.60,
        shipping: 9.99,
        total: 463.57,
        shippingAddress: JSON.stringify({
          name: 'Sarah Johnson',
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'US',
          phone: '+1-555-0102',
        }),
        paymentMethod: 'card',
        paymentStatus: 'paid',
        status: 'shipped',
        items: {
          create: [
            { productId: createdProducts[8].id, quantity: 1, price: 189.99 },
            { productId: createdProducts[20].id, quantity: 1, price: 16.99 },
            { productId: createdProducts[30].id, quantity: 1, price: 59.99 },
            { productId: createdProducts[34].id, quantity: 1, price: 34.99 },
            { productId: createdProducts[25].id, quantity: 1, price: 349.99 },
          ],
        },
      },
    });

    // Create a pending order
    const order3 = await db.order.create({
      data: {
        userId: customer3.id,
        subtotal: 1098.98,
        tax: 87.92,
        shipping: 0,
        total: 1186.90,
        shippingAddress: JSON.stringify({
          name: 'Mike Wilson',
          street: '789 Pine Road',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'US',
          phone: '+1-555-0103',
        }),
        paymentMethod: 'card',
        paymentStatus: 'paid',
        status: 'processing',
        items: {
          create: [
            { productId: createdProducts[1].id, quantity: 1, price: 999.99 },
            { productId: createdProducts[24].id, quantity: 1, price: 49.99 },
            { productId: createdProducts[33].id, quantity: 1, price: 49.99 },
          ],
        },
      },
    });

    // Silence the unused variable warnings
    void order;
    void order2;
    void order3;

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: String(error) },
      { status: 500 }
    );
  }
}
