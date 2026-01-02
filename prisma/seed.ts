import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs";

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@example.com'
  const rawPassword = 'MoManAdmin123!'

  console.log(`Check for existing admin: ${email}`)

  // 1. Check if admin already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.log('Admin already exists. Skipping creation.')
    return
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(rawPassword, 10)

  // 3. Create the Admin
  const admin = await prisma.user.create({
    data: {
      firstName: 'Super',
      lastName: 'Admin',
      email: email,
      password: hashedPassword,
      accountType: 'Admin',
      isActive: true,
      memberSince: new Date(),
    },
  })

  console.log(`Admin created successfully: ${admin.email}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })