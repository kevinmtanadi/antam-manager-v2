import { db } from "@/app/db";
import { log, stock, transaction, transactionItem, transactionStatus } from "@/schema";
import { create } from "domain";
import { count, desc, eq, ilike, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const {searchParams: queryParams} = new URL(request.url)
    const page = queryParams.get("page")
    const rowPerPage = queryParams.get("rows_per_page")
    const id = queryParams.get("id")
    const date = queryParams.get("date")
    const status = queryParams.get("status")
    const queryStatus = transactionStatus.enumValues[status === "PURCHASE" ? 0 : 1]
        
    const query = db.select()
        .from(transaction)
        .orderBy(desc(transaction.createdAt))
        .limit(rowPerPage ? Number(rowPerPage) : 10)
        .offset((Number(page) - 1) * Number(rowPerPage)) as any
    
    const applyFilter = (query: any) => {
        if (id) {
            query = query.where(
                ilike(transaction.id, `%${id}%`)
            )
        }
        
        if (date) {
            query = query.where(
                eq(transaction.createdAt, new Date(date))
            )
        }
        
        if (status) {
            query = query.where(
                eq(transaction.status, queryStatus)
            )
        }
        
        return query
    }
    
    const transactions = await applyFilter(query)
    
    const totalItems = await db.select({
        count: count()   
    }).from(transaction)
    
    const totalFilteredQuery = db.select({
        count: count()
    }).from(transaction)
    const totalFiltered = await applyFilter(totalFilteredQuery)
        
     
    return NextResponse.json({
        transactions,
        totalItems: totalItems[0].count,
        totalFiltered: totalFiltered[0].count
    }, {status: 200})
}


export async function POST(request: NextRequest) {
    const body = await request.json()
    const items = body.items as any[]
    
    let transactionItems = []
    let totalPrice = 0
    let profit = 0
    
    switch (body.status) {
        case "PURCHASE":
            for (const item of items) {
                transactionItems.push({
                    stockId: item.stockId,
                    productId: item.productId,
                    price: item.price,
                })
                totalPrice += item.price
            }
            break
        case "SALE":
            for (const item of items) {
                const stockItem = await db.select()
                    .from(stock)
                    .where(eq(stock.id, item.stockId))
                    .limit(1)
                
                if (!stockItem) {
                    return NextResponse.json({message: `Item with ID: ${item.stockId} not found`}, {status: 404})
                }
                
                transactionItems.push({
                    stockId: stockItem[0].id,
                    productId: stockItem[0].productId,
                    price: item.price,
                })
                
                totalPrice += item.price
                profit += item.price - item.cost
            }
            break
        default:
            return NextResponse.json({message: "Invalid status"}, {status: 400})    
    }
    
    
    try {
        const date = new Date()
        const transactionId = `TR${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
    
        const result = await db.transaction(async (tx) => {
            try {
                const createdAt = new Date(body.createdAt)
            
                const tr = await tx.insert(transaction).values({
                    id: transactionId,
                    totalPrice: totalPrice,
                    profit: profit,
                    status: transactionStatus.enumValues[body.status === "PURCHASE" ? 0 : 1],
                    createdAt: createdAt
                }).returning({id: transaction.id})
            
                switch (body.status) {
                    case "PURCHASE":
                        const stocks = await db.select({ count: count() })
                            .from(stock)
                            .where(inArray(stock.id, transactionItems
                            .map(item => item.stockId)))
                        
                        if (stocks[0].count > 0) {
                            throw "Item sudah ada"
                        }
                        
                        await db.insert(stock).values(transactionItems.map(item => ({
                            id: item.stockId,
                            productId: item.productId,
                            cost: item.price,
                            transactionId: tr[0].id,
                            createdAt: createdAt
                        })))
                        
                        break
                    case "SALE":
                        await db.delete(stock)
                            .where(inArray(stock.id, transactionItems.map(item => item.stockId)))
                        break
                    default:
                        throw "Invalid status" 
                }
            
                await tx.insert(transactionItem).values(transactionItems.map((item) => {
                    return {
                        transactionId: tr[0].id,
                        productId: item.productId,
                        stockId: item.stockId,
                        price: item.price
                    }
                }))
                
                return tr[0].id
            } catch(err) {
                console.log(err)
                await tx.rollback()
            }
            
        })

        
        return NextResponse.json(result, {status: 200})
    } catch (e) {
        return NextResponse.json({message: "Terjadi kendala saat melakukan transaksi", error: e}, {status: 500})
    }
}
export async function DELETE(request: NextRequest) {
    const { searchParams: queryParams } = new URL(request.url)
    const transactionId = queryParams.get('id')
    if (transactionId === "" || !transactionId) {
        return NextResponse.json({
            message: "Transaction ID is required",
        }, {status: 400})
    }
    
    await db.delete(transactionItem).where(eq(transactionItem.transactionId, transactionId))
    await db.delete(transaction).where(eq(transaction.id, transactionId))

    return NextResponse.json({message: "success"}, {status: 200})
}