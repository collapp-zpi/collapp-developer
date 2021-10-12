import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaExtendedAdapter } from '../../../config/PrismaExtendedAdapter'
import { prisma } from '../../../config/PrismaClient'

export default NextAuth({
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SMTP_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: '../../',
    error: '../../error',
    signOut: '../../',
    verifyRequest: '../../',
    newUser: '../../',
  },
  adapter: PrismaExtendedAdapter('admin'),
  secret: process.env.AUTH_EMAIL_SECRET,
  callbacks: {
    async signIn({ user: { email } }) {
      if (!email) return false

      const admin = await prisma.adminUser.findUnique({
        where: { email },
      })

      if (admin) {
        return true
      }
      return false
    },
  },
})
