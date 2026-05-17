import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { comparePassword } from '@/lib/auth-helpers'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const developer = await db.developer.findUnique({ where: { email: credentials.email } })
        if (!developer) return null
        const isValid = await comparePassword(credentials.password, developer.password)
        if (!isValid) return null
        return {
          id: developer.id,
          email: developer.email,
          name: developer.name,
          role: developer.role,
          plan: developer.plan,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as Record<string, unknown>).role
        token.plan = (user as Record<string, unknown>).plan
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as Record<string, unknown>).id = token.id
        ;(session.user as Record<string, unknown>).role = token.role
        ;(session.user as Record<string, unknown>).plan = token.plan
      }
      return session
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
