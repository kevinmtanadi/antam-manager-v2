import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const {searchParams: queryParams} = new URL(request.url)
    const params = queryParams.get("search")
    const page = queryParams.get("page")
    const rowPerPage = queryParams.get("rows_per_page")
    const weight = queryParams.get("weight")
    
    const stocks = await prisma.stock.findMany({
        where: {
            product: {
                weight: Number(weight) || undefined,
            },
            OR: [
                {
                    productId: {
                        startsWith: params || "",
                        mode: "insensitive"
                    }
                },
                {
                    id: {
                        contains: params || "",
                        mode: "insensitive"
                    }
                },
            ]
        },
        include: {
            product: {
                select: {
                    name: true,
                    weight: true
                }
            }
        },
        orderBy: {
            product: {
                weight: "asc"
            }
        },
        take: rowPerPage ? Number(rowPerPage) : 10,
        skip: (Number(page) - 1) * Number(rowPerPage),
    })
    
    const totalItems = await prisma.stock.count({})
    const totalFiltered = await prisma.stock.count({
        where: {
            product: {
                weight: Number(weight) || undefined,
            },
            OR: [
                {
                    productId: {
                        startsWith: params || "",
                        mode: "insensitive"
                    }
                },
                {
                    id: {
                     contains: params || "",
                        mode: "insensitive"
                    }
                }
            ]
        }
    })
     
    return NextResponse.json({
        stocks,
        totalItems,
        totalFiltered
    }, {status: 200})

     
}
