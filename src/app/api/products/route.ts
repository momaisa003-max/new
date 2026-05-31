import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

function parseProduct(product: Record<string, unknown>) {
  return {
    ...product,
    images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
    tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const where: Record<string, unknown> = { active: true };

    if (category) {
      const categoryRecord = await db.category.findUnique({
        where: { slug: category },
      });
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (sort === 'featured') {
      where.featured = true;
    }

    const orderBy: Record<string, string> = {};
    switch (sort) {
      case 'price_asc':
        orderBy.price = 'asc';
        break;
      case 'price_desc':
        orderBy.price = 'desc';
        break;
      case 'rating':
        orderBy.rating = 'desc';
        break;
      case 'newest':
      default:
        orderBy.createdAt = 'desc';
        break;
    }

    const total = await db.product.count({ where });
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const products = await db.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: limit,
    });

    const parsedProducts = products.map(parseProduct);

    return NextResponse.json({
      products: parsedProducts,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, comparePrice, images, categoryId, stock, featured, active, sku, tags } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, price, and categoryId are required' },
        { status: 400 }
      );
    }

    const slug = body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

    const product = await db.product.create({
      data: {
        name,
        slug,
        description: description || name,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        images: JSON.stringify(images || []),
        categoryId,
        stock: stock || 0,
        featured: featured || false,
        active: active !== undefined ? active : true,
        sku: sku || null,
        tags: JSON.stringify(tags || []),
      },
      include: { category: true },
    });

    return NextResponse.json({ product: parseProduct(product) }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
