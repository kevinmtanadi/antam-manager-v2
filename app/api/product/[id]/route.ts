import { NextRequest, NextResponse } from "next/server"
import { bindPathParams } from "../../paramsParser"
import { db } from "@/app/db"
import { product, stock } from "@/schema"
import { eq } from "drizzle-orm"


export async function GET(request: NextRequest) {
    const params = bindPathParams(request)
    if (params === "") {
        return NextResponse.json({message: "Product ID is required"}, {status: 400})
    }
    
    const { searchParams: queryParams } = new URL(request.url)
    const fetchStock = queryParams.get('fetch_stock')
    
    const productData = await db.select().
        from(product).
        where(eq(product.id, params))
    
    if (productData.length === 0) {
        return NextResponse.json({message: "Product not found"}, {status: 404})
    }
    
    if (!fetchStock) {
        return NextResponse.json({product: productData[0]}, {status: 200})    
    }
    
    const stockData = await db.select()
        .from(stock)
        .where(eq(stock.productId, params))
        
    
    return NextResponse.json({
        product: productData[0],
        stock: stockData
    }, {status: 200})
}
