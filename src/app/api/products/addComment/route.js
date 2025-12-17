import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    console.log(token)
    if (!token) {
        console.log('cant access')
        return NextResponse.json(
            { error: "غير مصرح لك بالدخول" },
            { status: 401 }
        );
    }

    return NextResponse.json({
        message: "تم التحقق بنجاح",
        user: token
    });
}