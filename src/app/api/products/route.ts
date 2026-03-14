import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const perPage = Number(searchParams.get("perPage")) || 12;
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const minPrice = Number(searchParams.get("minPrice")) || undefined;
    const maxPrice = Number(searchParams.get("maxPrice")) || undefined;
    const sort = searchParams.get("sort") || "newest";

    const where = {
      status: "ACTIVE" as const,
      ...(category && { category: { slug: category } }),
      ...(search && {
        title: { contains: search, mode: "insensitive" as const },
      }),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice && { gte: minPrice }),
              ...(maxPrice && { lte: maxPrice }),
            },
          }
        : {}),
    };

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
          ? { price: "desc" as const }
          : { createdAt: "desc" as const };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          category: { select: { name: true, slug: true } },
          vendor: { select: { name: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, perPage });
  } catch (err) {
    console.error("[PRODUCTS GET]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, description, price, categoryId, status } = await req.json();

    if (!title || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const slug = slugify(title);

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: Number(price),
        categoryId,
        vendorId: session.user.id,
        status: status || "DRAFT",
        images: [],
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("[PRODUCTS POST]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
