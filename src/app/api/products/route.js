import connectDB from "../../../lib/mongodb";
import Product from "../../../../models/Product";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET() {
    await connectDB();
    try {
        const products = await Product.find();

        return new Response(JSON.stringify(products), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error("Failed to fetch products:", err);
        return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}

export async function POST(req) {
    try {
        await connectDB();

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json(
                { message: "يجب تسجيل الدخول أولاً للقيام بهذا الإجراء" },
                { status: 401 }
            );
        }

        if (token.role !== 'admin') {
            return NextResponse.json(
                { message: "غير مسموح لك بإضافة منتجات، هذه الصلاحية للمسؤولين فقط" },
                { status: 403 }
            );
        }

        const rawData = await req.json();

        const customId = crypto.randomBytes(15).toString('hex').slice(0, 25);

        const finalData = {
            ...rawData,
            id: customId,
            sku: rawData.sku || `SKU-${Math.floor(Math.random() * 100000)}`,
            price: Number(rawData.price) || 0,
            oldPrice: Number(rawData.oldPrice) || 0,

            inventory: {
                totalStock: Number(rawData.inventory?.totalStock) || 0,
                availability: rawData.inventory?.availability || "in_stock",
                lowStockThreshold: 5
            },

            discount: {
                percentage: Number(rawData.oldPrice) > 0
                    ? Math.round(100 - ((Number(rawData.price) / Number(rawData.oldPrice)) * 100))
                    : 0,
                isActive: Number(rawData.price) < Number(rawData.oldPrice),
                expiresAt: rawData.discount?.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },

            variants: (rawData.variants || []).map(v => ({
                variantId: v.variantId || Date.now().toString(),
                color: v.color || "N/A",
                hex: v.hex || "#000000",
                stock: Number(v.stock) || 0,
                images: v.images || []
            })),

            images: {
                main: rawData.images?.main || "",
                gallery: rawData.images?.gallery || [],
                thumbnail: rawData.images?.thumbnail || ""
            },

            specifications: {
                ...rawData.specifications,
                compartments: Number(rawData.specifications?.compartments) || 0
            },

            status: "active",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const newProduct = await Product.create(finalData);
        return NextResponse.json(newProduct, { status: 201 });

    } catch (err) {
        console.error("Critical API Error:", err);
        return NextResponse.json(
            {
                message: "حدث خطأ داخلي في الخادم",
                error: err.message
            },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        await connectDB();

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token || token.role !== 'admin') {
            return NextResponse.json(
                { message: "غير مسموح لك بالقيام بهذا الإجراء" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const productId = body.id;

        console.log('Product ID to delete:', productId);

        if (!productId) {
            return NextResponse.json(
                { message: "يجب تحديد معرف المنتج (ID) لحذفه" },
                { status: 400 }
            );
        }

        const deletedProduct = await Product.findOneAndDelete({ id: productId });

        if (!deletedProduct) {
            return NextResponse.json(
                { message: "المنتج غير موجود أو تم حذفه مسبقاً" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "تم حذف المنتج بنجاح", deletedId: productId },
            { status: 200 }
        );

    } catch (err) {
        console.error("Delete Error:", err);
        return NextResponse.json(
            { message: "حدث خطأ أثناء محاولة الحذف", error: err.message },
            { status: 500 }
        );
    }
}