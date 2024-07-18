import { NextRequest, NextResponse } from "next/server"
import { bindPathParams } from "../../paramsParser"
import { db } from "@/app/db"
import { transaction, transactionItem } from "@/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
    const transactionId = bindPathParams(request)
    
    const transactionDetail = await db.select().from(transaction).where(eq(transaction.id, transactionId)).limit(1)
    
    const transactionItems = await db.select({
        transactionItem
    })
        .from(transaction)
        .leftJoin(transactionItem, eq(transaction.id, transactionItem.transactionId))
        .where(eq(transaction.id, transactionId))
    
    
    return NextResponse.json({
        transaction: transactionDetail[0],
        items: transactionItems.map((item) => item.transactionItem)
    }, {status: 200})
}
