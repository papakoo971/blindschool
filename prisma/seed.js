const { randomBytes, scryptSync } = require("node:crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

async function main() {
  const school = await prisma.school.upsert({
    where: { schoolCode: "DEMO-HIGH-DAEGU" },
    update: {},
    create: {
      schoolCode: "DEMO-HIGH-DAEGU",
      name: "대구데모고등학교",
      region: "대구",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "teacher.demo@blindschool.local" },
    update: {
      schoolId: school.id,
      phoneVerifiedAt: new Date(),
      isActive: true,
    },
    create: {
      schoolId: school.id,
      role: "user",
      realNameEnc: "DEMO:홍길동",
      phoneEnc: "DEMO:01012345678",
      phoneVerifiedAt: new Date(),
      email: "teacher.demo@blindschool.local",
      passwordHash: hashPassword("Test1234!"),
      jobGroup: "교사",
      department: "교무부",
      isActive: true,
    },
  });

  await prisma.anonymousProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      anonNickname: "대구고등_001",
    },
  });

  await prisma.userVerificationState.upsert({
    where: { userId: user.id },
    update: {
      isVerified: true,
      verifiedAt: new Date(),
    },
    create: {
      userId: user.id,
      isVerified: true,
      verifiedAt: new Date(),
    },
  });

  console.log("Seeded test staff account:");
  console.log("email: teacher.demo@blindschool.local");
  console.log("password: Test1234!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
