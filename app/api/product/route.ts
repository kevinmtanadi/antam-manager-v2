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
        min_price: sql`COALESCE(MIN(${stock.cost}), 0)`,
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
