import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (product.vendorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...body,
        slug: body.title ? slugify(body.title) : product.slug,
        price: body.price ? Number(body.price) : product.price,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PRODUCT PATCH]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (product.vendorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PRODUCT DELETE]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
