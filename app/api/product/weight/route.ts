import { db } from "@/app/db"
import { product } from "@/schema"
import { asc } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const weights = await db.selectDistinctOn([product.weight], {
        weight: product.weight
    })
    .from(product)
    .orderBy(asc(product.weight))
    
    if (!weights) {
        return NextResponse.json({message: "Weights not found"}, {status: 404})   
    }
    
    return NextResponse.json(weights, {status: 200})
    
}
