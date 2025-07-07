import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// creates sql connection using url
export const sql = neon(process.env.DATABASE_URL);
