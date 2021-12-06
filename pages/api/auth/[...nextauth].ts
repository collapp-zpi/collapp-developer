import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import Auth0Provider from 'next-auth/providers/auth0'
import { PrismaExtendedAdapter } from 'shared/utils/PrismaExtendedAdapter'

export default NextAuth({
  providers: [
    ...(!process.env.CYPRESS_TEST
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : [
          Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID as string,
            clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
            issuer: process.env.AUTH0_ISSUER,
          }),
        ]),
  ],
  pages: {
    ...(!process.env.CYPRESS_TEST && { signIn: '../../' }),
    error: '../../error',
    signOut: '../../',
  },
  adapter: PrismaExtendedAdapter('developer'),
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      if (session) session.userId = user.id
      return session
    },
  },
})
