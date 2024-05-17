import { db } from "@/app/db"
import { product } from "@/schema"
import { asc } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const types = await db.select({
        id: product.id,
        name: product.name
    })
    .from(product)
    .orderBy(asc(product.weight))
    
    if (!types) {
        return NextResponse.json({message: "Types not found"}, {status: 404})   
    }

    
    return NextResponse.json(types, {status: 200})
}
