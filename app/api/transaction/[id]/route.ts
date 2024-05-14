import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { bindPathParams } from "../../paramsParser"

export async function GET(request: NextRequest) {
    const transactionId = bindPathParams(request)
    
    const transactions = await prisma.transaction.findFirst({
        where: {
            id: transactionId
        },
        include: {
            transactionItems: true
        }
    })
    return NextResponse.json(transactions, {status: 200})
}
