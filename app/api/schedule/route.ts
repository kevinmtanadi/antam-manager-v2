import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/db'
import { product } from '@/schema'

export const config = {
  runtime: 'edge',
}

export default async function GET(req: NextRequest) {
    const types = await db.select({})
    .from(product)
    .limit(1)
    
    if (!types) {
        return NextResponse.json({message: "Types not found"}, {status: 404})   
    }
    
    return NextResponse.json(types, {status: 200})
}