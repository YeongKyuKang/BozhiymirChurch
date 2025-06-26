import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, password, firstName, lastName } = body

    // Validation
    if (!email || !username || !password || !firstName || !lastName) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 })
    }

    const result = await AuthService.register({
      email,
      username,
      password,
      firstName,
      lastName,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Registration failed" }, { status: 400 })
  }
}
