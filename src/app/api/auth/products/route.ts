import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
