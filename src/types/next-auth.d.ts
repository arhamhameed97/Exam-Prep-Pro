// NextAuth type extensions

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      level: string
    }
  }

  interface User {
    id: string
    email: string
    name: string | null
    level: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    level: string
  }
}
