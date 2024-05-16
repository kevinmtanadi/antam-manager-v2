import { NextRequest } from "next/server";

export function bindPathParams(request: NextRequest) {
    const url = new URL(request.url)
    
    const removedQuery = url.toString().split('?')[0]
    
    const urlSplitted = removedQuery.toString().split('/')
    const params = urlSplitted[urlSplitted.length - 1]
    
    return params
}