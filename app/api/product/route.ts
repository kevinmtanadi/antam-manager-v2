import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod"

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url)
    const params = searchParams.get("search")

    const filter = params ? `WHERE p.id LIKE '${params}%' OR p.name LIKE '%${params}%'` : ""
    
    const products = await prisma.$queryRaw`
        SELECT
            p.id,
            p.name,
            p.weight,
            COALESCE(MIN(s.cost), 0) AS min_price,
            COALESCE(AVG(s.cost), 0)::float AS avg_price,
            COUNT(s.id)::int AS stock
        FROM
            "Product" p
            LEFT JOIN "Stock" s ON p.id = s."productId"
        || ${filter}
        GROUP BY p.id
        ORDER BY p.weight ASC`
    
     
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
    
    const newProduct = await prisma.product.create({
        data: {
            id: body.id,
            name: body.name,
            weight: body.weight
        }
    })
    
    return NextResponse.json(newProduct, {status: 200})
}