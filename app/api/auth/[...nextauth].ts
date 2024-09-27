import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyPassword } from '@/lib/auth'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }
        
        const client = await connectToDatabase()
        const usersCollection = client.db().collection('users')
        
        const user = await usersCollection.findOne({ email: credentials.email })
        
        if (!user) {
          client.close()
          throw new Error('No user found with this email')
        }
        
        const isValid = await verifyPassword(credentials.password, user.password)
        
        if (!isValid) {
          client.close()
          throw new Error('Incorrect password')
        }
        
        client.close()
        return { 
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt'
  },
})

export { handler as GET, handler as POST }