import connectDB from "../../lib/mongodb.js";
import Product from "../../../models/Product.js";
import { products } from "../../../data/products.js";

async function seed() {
    try {
        await connectDB();

        await Product.deleteMany({});
        await Product.insertMany(products);

        console.log("Seeding finished successfully");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seed();