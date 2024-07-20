import "dotenv/config";

export const ALLOWED_ORIGINS = process.env["ALLOWED_ORIGINS"];
export const MONGO_URI = process.env["MONGO_URI"] || "";
export const NODE_ENV = process.env["NODE_ENV"];
export const PORT = process.env["PORT"];
