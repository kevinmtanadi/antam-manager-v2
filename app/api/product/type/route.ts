import { db } from "@/app/db"
import { product } from "@/schema"
import { asc } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const types = await db.select({
            id: product.id,
            name: product.name
        })
        .from(product)
        .orderBy(asc(product.weight))
        
    
        return NextResponse.json(types, {status: 200})
    } catch(err) {
        return NextResponse.json(err, {status: 500})
    }
}
