import { PrismaClient } from '@prisma/client';
import crypto, { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const hashPassword = (password: string): string => {
  return crypto.scryptSync(password, 'local-salt', 64).toString('hex');
};

async function main() {
  const email = 'admin@pksingh.com';
  const password = 'adminpassword123';
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log('Admin already exists.');
    return;
  }

  const user = await prisma.user.create({
    data: {
      supabaseId: randomUUID(),
      email,
      fullName: 'PK Singh Admin',
      role: 'ADMIN',
      passwordHash: hashPassword(password),
    }
  });

  console.log(`Created admin user: ${user.email} with password: ${password}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
