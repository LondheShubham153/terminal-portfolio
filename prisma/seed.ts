import bcrypt from "bcryptjs";
import { db } from "../lib/db";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before seeding");
  }

  const normalizedEmail = adminEmail.toLowerCase();

  await db.adminUser.upsert({
    where: { email: normalizedEmail },
    update: {},
    create: {
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });

  const skills = [
    { name: "TypeScript", category: "Language", level: 4, order: 0 },
    { name: "React", category: "Frontend", level: 4, order: 1 },
    { name: "Next.js", category: "Frontend", level: 4, order: 2 },
    { name: "Node.js", category: "Backend", level: 4, order: 3 },
  ];

  for (const skill of skills) {
    await db.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
