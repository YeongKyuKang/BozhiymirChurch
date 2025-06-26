import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
import { prisma } from "@/lib/database"

export async function GET() {
  try {
    const content = await prisma.contentItem.findMany({
      orderBy: { category: "asc" },
    })
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch content" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = await AuthService.getUserFromToken(token)

    if (!user || !AuthService.canEditContent(user)) {
      return NextResponse.json({ message: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { key, value, type, category, description } = body

    const contentItem = await prisma.contentItem.upsert({
      where: { key },
      update: {
        value,
        type,
        category,
        description,
        updatedAt: new Date(),
      },
      create: {
        key,
        value,
        type,
        category,
        description,
        createdBy: user.id,
      },
    })

    return NextResponse.json(contentItem)
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to save content" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = await AuthService.getUserFromToken(token)

    if (!user || !AuthService.isAdministrator(user)) {
      return NextResponse.json({ message: "Administrator access required" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (!key) {
      return NextResponse.json({ message: "Content key is required" }, { status: 400 })
    }

    await prisma.contentItem.delete({
      where: { key },
    })

    return NextResponse.json({ message: "Content deleted successfully" })
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to delete content" }, { status: 500 })
  }
}
