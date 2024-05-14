import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { bindPathParams } from "../../paramsParser"

export async function GET(request: NextRequest) {
    const params = bindPathParams(request)
    const product = await prisma.product.findFirst({
        where: {
            id: params,
        },
        include: {
            stocks: true,
        }
    })
    return NextResponse.json(product, {status: 200})
}
