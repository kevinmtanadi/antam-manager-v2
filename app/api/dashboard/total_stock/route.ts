import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { stock } from "@/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    let query = db.select({
        value: sql`COALESCE(SUM(${stock.cost}), 0)::float`,
    }).from(stock)
    
    const total_stock = await query
    
     
    return NextResponse.json(total_stock[0], {status: 200})
}
