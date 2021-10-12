// @ts-nocheck
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const PrismaExtendedAdapter = (prefix: string) => {
  prisma.user = prisma[prefix + 'User']
  prisma.account = prisma[prefix + 'Account']
  prisma.session = prisma[prefix + 'Session']
  prisma.verificationToken = prisma[prefix + 'VerificationToken']
  return PrismaAdapter(prisma)
}
