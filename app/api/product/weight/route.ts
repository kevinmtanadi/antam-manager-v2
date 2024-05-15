import { db } from "@/app/db"
import { product } from "@/schema"
import { asc } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const weights = await db.selectDistinctOn([product.weight], {
            weight: product.weight
        })
        .from(product)
        .orderBy(asc(product.weight))
        
        return NextResponse.json(weights, {status: 200})
    } catch(err) {
        return NextResponse.json(err, {status: 500})
    }
}
