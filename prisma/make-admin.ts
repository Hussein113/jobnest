import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const email = process.argv[2]?.toLowerCase();

async function main() {
  if (!email) throw new Error("Usage: npm run admin:promote -- you@example.com");
  const user = await prisma.user.update({ where: { email }, data: { role: "ADMIN", status: "ACTIVE" } });
  console.log(`${user.email} is now an admin`);
}

main().finally(() => prisma.$disconnect());
