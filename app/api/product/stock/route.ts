import { db } from "@/app/db"
import { log, product, stock } from "@/schema"
import { asc, count, eq, ilike, like, or } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const {searchParams: queryParams} = new URL(request.url)
    const search = queryParams.get("search")
    const page = queryParams.get("page")
    const rowPerPage = queryParams.get("rows_per_page")
    const weight = queryParams.get("weight")
    const productId = queryParams.get("productId")
    
    let query = db.select({
        id: stock.id,
        productId: stock.productId,
        cost: stock.cost,
        createdAt: stock.createdAt,
        updatedAt: stock.updatedAt,
        product: {
            name: product.name,
            weight: product.weight
        }
    })
    .from(stock)
    .leftJoin(product, eq(product.id, stock.productId))
    .orderBy(asc(product.weight))
    .limit(rowPerPage ? Number(rowPerPage) : 10)
    .offset((Number(page) - 1) * Number(rowPerPage)) as any
    
    const applyFilter = (query: any) => {
        if (search) {
            query = query.where(ilike(stock.id, `${search}%`));
        }
        if (weight) {
            query = query.where(eq(product.weight, Number(weight)))
        }
        if (productId && productId !== "") {
            query = query.where(eq(stock.productId, productId))   
        }
        
        return query
    }
    
    const stocks = await applyFilter(query)
    
    const totalItems = await db.select({
        count: count()   
    }).from(stock)
    
    const totalFilteredQuery = db.select({
        count: count()
    }).from(stock)
    .leftJoin(product, eq(product.id, stock.productId));
    const totalFiltered = await applyFilter(totalFilteredQuery)
     
    return NextResponse.json({
        stocks,
        totalItems: totalItems[0].count,
        totalFiltered: totalFiltered[0].count
    }, {status: 200})
}


export async function DELETE(request: NextRequest) {
    const { searchParams: queryParams } = new URL(request.url)
    const stockId = queryParams.get('id')
    if (stockId === "" || !stockId) {
        return NextResponse.json({
            message: "Product ID is required",
        }, {status: 400})
    }
    
    await db.delete(stock).where(eq(stock.id, stockId))
    
    await db.insert(log).values({
        action: "delete",
        detail: `Menghapus produk stok ${stock.id}`,
        identifier: stockId
    })
    
    return NextResponse.json(stock, {status: 200})
}

export async function PUT(request: NextRequest) {
    const body = await request.json()
    
    const id = body.id
    
    const updatedStock = await db.update(stock).set({
        id: body.newId,
        productId: body.productId,
        cost: body.cost
    }).where(eq(stock.id, id))
    
    
    return NextResponse.json(updatedStock, {status: 200})
}