import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const types = await prisma.product.findMany({
        select: {
            id: true,
            name: true
        },
        distinct: ["id"],
        orderBy: {
            weight: "asc"
        }
    })
    return NextResponse.json(types, {status: 200})
}
