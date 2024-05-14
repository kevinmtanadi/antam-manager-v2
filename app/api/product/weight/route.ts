import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { bindPathParams } from "../../paramsParser"

export async function GET(request: NextRequest) {
    const weights = await prisma.product.findMany({
        select: {
            weight: true
        },
        distinct: ["weight"],
        orderBy: {
            weight: "asc"
        }
    })
    return NextResponse.json(weights, {status: 200})
}
