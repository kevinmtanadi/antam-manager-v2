import { bindPathParams } from "@/app/api/paramsParser"
import { db } from "@/app/db"
import { product, stock } from "@/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const stockId = bindPathParams(request)
    
    const stockData = await db.select().
        from(stock)
        .innerJoin(product, eq(product.id, stock.productId))
        .where(eq(stock.id, stockId))
   

    return NextResponse.json(stockData, {status: 200})

     
}
