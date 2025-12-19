import connectDB from "../../../../lib/mongodb";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import User from "../../../../../models/User"

export async function POST(req) {
    await connectDB();
    try {

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 401 });
        }

        const { savedProductsId } = await req.json();
        if (!savedProductsId) {
            return NextResponse.json({ error: "البيانات غير مكتملة" }, { status: 400 });
        }

        const currentUser = await User.findOne({ email: token?.email.trim() }); // the problem

        if (!currentUser) {
            return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
        }

        if (!currentUser.cart) currentUser.cart = [];

        if (!currentUser.cart.some(item => item.productId.toString() === savedProductsId)) {
            currentUser.cart.push({ productId: savedProductsId, quantity: 1 });
            await currentUser.save();
        }

        return NextResponse.json({
            message: "تم إضافة المنتج بنجاح",
            cart: currentUser.cart
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 });
        }

        const { productId } = await req.json();

        if (!productId) {
            return NextResponse.json({ error: "معرف المنتج مطلوب" }, { status: 400 });
        }

        const updatedUser = await User.findOneAndUpdate(
            { email: token.email.trim() },
            {
                $pull: { cart: { productId: productId } }
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
        }

        return NextResponse.json({
            message: "تم حذف المنتج من العربة",
            cart: updatedUser.cart
        });

    } catch (err) {
        console.error("Delete Error:", err);
        return NextResponse.json({ error: "حدث خطأ أثناء الحذف" }, { status: 500 });
    }
}
