import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "./database"
import type { UserRole } from "@prisma/client"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface AuthUser {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  position: UserRole
  isActive: boolean
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
  }

  static verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string }
    } catch {
      return null
    }
  }

  static async register(data: {
    email: string
    username: string
    password: string
    firstName: string
    lastName: string
  }) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    })

    if (existingUser) {
      throw new Error("User with this email or username already exists")
    }

    const hashedPassword = await this.hashPassword(data.password)

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        position: true,
        isActive: true,
      },
    })

    const token = this.generateToken(user.id)

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })

    return { user, token }
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.isActive) {
      throw new Error("Invalid credentials")
    }

    const isValidPassword = await this.verifyPassword(password, user.password)
    if (!isValidPassword) {
      throw new Error("Invalid credentials")
    }

    const token = this.generateToken(user.id)

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        position: user.position,
        isActive: user.isActive,
      },
      token,
    }
  }

  static async getUserFromToken(token: string): Promise<AuthUser | null> {
    try {
      const decoded = this.verifyToken(token)
      if (!decoded) return null

      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      })

      if (!session || session.expiresAt < new Date()) {
        return null
      }

      return {
        id: session.user.id,
        email: session.user.email,
        username: session.user.username,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        position: session.user.position,
        isActive: session.user.isActive,
      }
    } catch {
      return null
    }
  }

  static async logout(token: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { token },
    })
  }

  static isAdministrator(user: AuthUser): boolean {
    return user.position === "ADMINISTRATOR"
  }

  static canEditContent(user: AuthUser): boolean {
    return ["ADMINISTRATOR", "LEADER"].includes(user.position)
  }
}
