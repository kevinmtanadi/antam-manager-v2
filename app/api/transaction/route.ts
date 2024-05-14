import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { env } from "process";
import z from "zod"

const fetchTransactionSchema = z.object({
    search: z.string().nullable(),
})

export async function GET(request: NextRequest) {
    const {searchParams: queryParams} = new URL(request.url)
    const page = queryParams.get("page")
    const rowPerPage = queryParams.get("rows_per_page")
    const id = queryParams.get("id")
    const date = queryParams.get("date")
    
    const transactions = await prisma.transaction.findMany({
        orderBy: {
            createdAt: "desc"
        },
        where: {
            id: {
                startsWith: id || "",
                mode: "insensitive"
            },
            createdAt: date  || undefined
        },
        take: rowPerPage ? Number(rowPerPage) : undefined,
        skip: (Number(page) - 1) * Number(rowPerPage),
    })
    
    const totalItems = await prisma.transaction.count({})
    const totalFiltered = await prisma.transaction.count({})
     
    return NextResponse.json({
        transactions,
        totalItems,
        totalFiltered
    }, {status: 200})
}


export async function POST(request: NextRequest) {
    const body = await request.json()
    const items = body.items as any[]
    
    let transactionItems = []
    let totalPrice = 0
    
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
                const stockItem = await prisma.stock.findUnique({
                    where: {
                        id: item.stockId
                    }
                })
                
                
                if (!stockItem) {
                    return NextResponse.json({message: `Item with ID: ${item.stockId} not found`}, {status: 404})
                }
                
                transactionItems.push({
                    stockId: stockItem.id,
                    productId: stockItem.productId,
                    price: item.price,
                })
                
                totalPrice += item.price
            }
            break
        default:
            return NextResponse.json({message: "Invalid status"}, {status: 400})    
    }
    
    
    try {
        const date = new Date()
        const transactionId = `TR${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
    
        const result = await prisma.$transaction(async (prisma) => {
            // CREATE TRANSACTION
            const newTransaction = await prisma.transaction.create({
                data: {
                    id: transactionId,
                    totalPrice: totalPrice,
                    transactionItems: {
                        create: transactionItems
                    },
                    status: body.status,
                    createdAt: body.createdAt
                }
            })
            
            switch (body.status) {
                case "PURCHASE":
                    const stocks = await prisma.stock.count({
                        where: {
                            id: {
                                in: transactionItems.map(item => item.stockId)
                            }
                        }
                    })
                    
                    if (stocks > 0) {
                        throw "Item sudah ada"
                    }
                    
                    await prisma.stock.createMany({
                        data: transactionItems.map(item => ({
                            id: item.stockId,
                            productId: item.productId,
                            cost: item.price,
                            transactionId: newTransaction.id,
                            createdAt: body.createdAt
                        }))
                    })
                    
                    break
                case "SALE":
                    await prisma.stock.deleteMany({
                        where: {
                            id: {
                                in: transactionItems.map(item => item.stockId)
                            }
                        }
                    })
                    break
                default:
                    throw "Invalid status"
            }
            
            return newTransaction
        })
        return NextResponse.json(result, {status: 200})
    } catch (e) {
        return NextResponse.json({message: "Terjadi kendala saat melakukan transaksi", error: e}, {status: 500})
    }
    
}