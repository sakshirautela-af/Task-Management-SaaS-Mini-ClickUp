import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";
const databaseUrl = new URL(process.env.DATABASE_URL || "");
const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: parseInt(databaseUrl.port || "3306", 10),
  user: databaseUrl.username,
  password: databaseUrl.password,
  database: databaseUrl.pathname.slice(1),
  connectionLimit: 10,
});
export const prisma = new PrismaClient({ adapter });
export default prisma;