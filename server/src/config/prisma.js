// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import { PrismaClient } from "@prisma/client";

// const adapter = new PrismaMariaDb({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "user",
//   password: process.env.DB_PASSWORD || "password",
//   database: process.env.DB_NAME || "miniclickup",
//   port: 3306,
// });
// export const prisma = new PrismaClient({ adapter });
// export default prisma;
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

export const prisma = new PrismaClient();

export default prisma;
