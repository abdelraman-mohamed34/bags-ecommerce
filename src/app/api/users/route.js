import connectDB from "@/lib/mongodb";
import User from "../../../../models/User";
import { getToken } from "next-auth/jwt";

export async function GET() {
    try {
        await connectDB();
        const users = await User.find();
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Failed to fetch users" }), { status: 500 });
    }
}

export async function PUT(req) {
    await connectDB();
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return new Response(JSON.stringify({ error: "غير مصرح لك بالوصول" }), { status: 401 });
        }

        const uploadedData = await req.json();

        const updatedUser = await User.findOneAndUpdate(
            { email: token.email },
            { $set: uploadedData },
            { new: true }
        );

        if (!updatedUser) {
            return new Response(JSON.stringify({ error: "المستخدم غير موجود" }), { status: 404 });
        }

        console.log("Updated User:", updatedUser);

        return new Response(JSON.stringify(updatedUser), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (err) {
        console.error("Update Error:", err);
        return new Response(JSON.stringify({ error: "فشل في تحديث البيانات" }), { status: 500 });
    }
}