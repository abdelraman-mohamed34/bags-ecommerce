import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "../../../../../models/Product";

export async function POST(req) {
    await connectDB();
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
        return NextResponse.json(
            { error: "غير مصرح لك بالدخول" },
            { status: 401 }
        );
    }

    const { productId, text, rating } = await req.json();

    const product = await Product.findOne({ id: productId });
    if (!product) {
        return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    product.reviews.push({
        userId: token.id,
        userName: token.name,
        rating,
        comment: text,
        createdAt: new Date()
    });

    await product.save();

    return NextResponse.json({
        message: "تم إضافة التعليق بنجاح",
        productId,
        comment: {
            userId: token.id,
            userName: token.name,
            rating,
            comment: text
        }
    });
}

export async function DELETE(req) {
    await connectDB();
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
        return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 401 });
    }

    try {
        const { productId, reviewId, reviewerId } = await req.json();

        if (token.id !== reviewerId && token.role !== "admin") {
            return NextResponse.json({ error: "لا تملك صلاحية حذف هذا التعليق" }, { status: 403 });
        }

        const product = await Product.findOneAndUpdate(
            { id: productId },
            { $pull: { reviews: { _id: reviewId } } },
            { new: true }
        );

        if (!product) {
            return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
        }

        return NextResponse.json({
            message: "تم حذف التعليق بنجاح",
            productId
        });

    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء الحذف" }, { status: 500 });
    }
}
