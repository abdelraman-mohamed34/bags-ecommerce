import mongoose from "mongoose";

// const url = 'mongodb+srv://alliances137_db_user:87ZLWf5I1kyjygni@bags-ecommerce-cluster.artx3re.mongodb.net/?appName=bags-ecommerce-cluster'
const url = process.env.MONGO_URL_CONNECT
let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

export default async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(url).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}