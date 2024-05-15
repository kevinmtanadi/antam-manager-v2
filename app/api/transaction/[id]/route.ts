import { NextRequest, NextResponse } from "next/server"
import { bindPathParams } from "../../paramsParser"
import { db } from "@/app/db"
import { transaction, transactionItem } from "@/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
    const transactionId = bindPathParams(request)
    
    const transactionData = await db.select()
        .from(transaction)
        .leftJoin(transactionItem, eq(transaction.id, transactionItem.transactionId))
        .where(eq(transaction.id, transactionId))
    
    
    return NextResponse.json(transactionData, {status: 200})
}
