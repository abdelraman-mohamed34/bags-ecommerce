import connectDB from "../../lib/mongodb.js";
import { user } from "../../../data/user.js";
import User from "../../../models/User.js";

async function seed() {
    try {
        await connectDB();

        await User.deleteMany({});
        await User.insertMany(user);

        console.log("Seeding finished successfully");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seed();