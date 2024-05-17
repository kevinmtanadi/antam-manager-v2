import { NextRequest, NextResponse } from "next/server";
import z from "zod"
import { db } from "@/app/db";
import { log, product, stock } from "@/schema";
import { asc, eq, ilike, like, or, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
    const {searchParams: queryParams} = new URL(request.url)
    const params = queryParams.get("search")
    
    let query = db.select({
        id: product.id,
        name: product.name,
        weight: product.weight,
        total_price: sql`COALESCE(SUM(${stock.cost}), 0)::int`,
        avg_price: sql`COALESCE(AVG(${stock.cost}), 0)::float`,
        stock: sql`COUNT(${stock.id})::int`
    }).from(product)
      .leftJoin(stock, eq(product.id, stock.productId))
      .groupBy(product.id)
      .orderBy(asc(product.weight)) as any;
    
    if (params) {
        query = query.where(
            or(
                ilike(product.name, `%${params}%`),
                ilike(product.id, `${params}%`)
            )
        );
    }
    
    const products = await query
    
     
    return NextResponse.json(products, {status: 200})
}

const createProductSchema = z.object({
    id: z.string().min(1).max(31),
    name: z.string().min(1).max(63),
    weight: z.number()
})

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createProductSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(validation.error.errors, {
            status: 400,
        })
    }
    
    await db.insert(product).values({
        id: body.id,
        name: body.name,
        weight: body.weight
    })

    await db.insert(log).values({
            action: "create",
            detail: `Membuat produk ${body.id} : ${body.name}`,
            identifier: body.id
    })
    
    return NextResponse.json({message: "success"}, {status: 200})
}

export async function PUT(request: NextRequest) {
    const body = await request.json()
    
    await db.update(product).set({
        id: body.newId,
        name: body.name,
        weight: body.weight
    }).where(eq(product.id, body.id))
    
    await db.insert(log).values({
        action: "update",
        detail: `Mengupdate produk ${body.id} : ${body.name}`,
        identifier: body.id
    })
    
    return NextResponse.json({message: "success"}, {status: 200})
}

export async function DELETE(request: NextRequest) {
    const { searchParams: queryParams } = new URL(request.url)
    const productId = queryParams.get('id')
    if (productId === "" || !productId) {
        return NextResponse.json({
            message: "Product ID is required",
        }, {status: 400})
    }
    
    await db.delete(product).where(eq(product.id, productId))
    
    await db.insert(log).values({
        action: "delete",
        detail: `Menghapus produk ${productId}`,
        identifier: productId
    })
    
    return NextResponse.json({message: "success"}, {status: 200})
}