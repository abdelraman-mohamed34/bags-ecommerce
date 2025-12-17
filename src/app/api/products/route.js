import connectDB from "../../../lib/mongodb";
import Product from "../../../../models/Product";

export async function GET() {
    try {
        await connectDB();
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
