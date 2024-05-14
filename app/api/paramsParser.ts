import { NextRequest } from "next/server";

export function bindPathParams(request: NextRequest) {
    const url = new URL(request.url)
    const urlSplitted = url.toString().split('/')
    const params = urlSplitted[urlSplitted.length - 1]
    
    return params
}