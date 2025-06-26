import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Logged out" })
    }

    const token = authHeader.substring(7)
    await AuthService.logout(token)

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Logout completed" })
  }
}
