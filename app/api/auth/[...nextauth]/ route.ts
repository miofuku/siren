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
        const client = await connectToDatabase()
        const usersCollection = client.db().collection('users')
        
        const user = await usersCollection.findOne({ email: credentials?.email })
        
        if (!user) {
          client.close()
          throw new Error('No user found with this email')
        }
        
        const isValid = await verifyPassword(credentials?.password, user.password)
        
        if (!isValid) {
          client.close()
          throw new Error('Incorrect password')
        }
        
        client.close()
        return { id: user._id.toString(), email: user.email, name: user.name }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
})

export { handler as GET, handler as POST }