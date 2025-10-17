import dotenv from "dotenv";
import pg from "pg";
const { Pool } = pg;

dotenv.config();

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const databaseConfig = {
  host,
  port: Number(port),
  database,
  user,
  password,
};
export const pool = new Pool(databaseConfig);

export async function testConnection() {
  try {
    await pool.query("select now()");
    console.log("Connexion to database sucessful");
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to access database");
  }
}
