import { bindPathParams } from "@/app/api/paramsParser"
import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const {searchParams: queryParams} = new URL(request.url)
    const productId = bindPathParams(request)
    
    const stock = await prisma.stock.findFirst({
        where: {
            id: productId,
        },
        include: {
            product: true,
        }
    })

    return NextResponse.json({
        stock,
    }, {status: 200})

     
}
