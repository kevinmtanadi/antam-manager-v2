import { NextRequest, NextResponse } from "next/server"
import { bindPathParams } from "../../paramsParser"
import { db } from "@/app/db"
import { product, stock } from "@/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
    const params = bindPathParams(request)
    
    const productData = await db.select().
        from(product).
        leftJoin(stock, eq(product.id, stock.productId)).
        where(eq(product.id, params))
        
    
    return NextResponse.json(productData, {status: 200})
}
