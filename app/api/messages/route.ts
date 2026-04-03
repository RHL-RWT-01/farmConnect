import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token) as any;
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { receiverId, content } = await req.json();

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "receiverId and content required" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId: decoded.id,
        receiverId,
        content,
      },
      include: {
        sender: { select: { name: true, image: true } },
        receiver: { select: { name: true, image: true } },
      },
    });

    // Create notification for the receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: "New message",
        message: `${decoded.name || "Someone"} sent you a message`,
        type: "info",
        link: "/messages",
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token) as any;
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("with") || searchParams.get("userId");
    const isContactsRequest = searchParams.get("contacts") === "true";

    // Get conversation with specific user
    if (otherUserId) {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: decoded.id, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: decoded.id },
          ],
        },
        include: {
          sender: { select: { name: true, image: true } },
          receiver: { select: { name: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      });

      // Mark unread as read
      await prisma.message.updateMany({
        where: {
          senderId: otherUserId,
          receiverId: decoded.id,
          read: false,
        },
        data: { read: true },
      });

      return NextResponse.json({ messages });
    }

    // Get conversation list / contacts
    const allMessages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: decoded.id }, { receiverId: decoded.id }],
      },
      include: {
        sender: { select: { id: true, name: true, image: true, role: true } },
        receiver: { select: { id: true, name: true, image: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by conversation partner
    const conversationMap = new Map<string, any>();
    for (const msg of allMessages) {
      const partnerId =
        msg.senderId === decoded.id ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(partnerId)) {
        const partner =
          msg.senderId === decoded.id ? msg.receiver : msg.sender;
        const unread = await prisma.message.count({
          where: {
            senderId: partnerId,
            receiverId: decoded.id,
            read: false,
          },
        });
        conversationMap.set(partnerId, {
          // "conversations" format
          partnerId,
          partnerName: partner.name,
          partnerImage: partner.image,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          unreadCount: unread,
          // "contacts" format
          id: partnerId,
          name: partner.name,
          image: partner.image,
          role: partner.role,
        });
      }
    }

    const list = Array.from(conversationMap.values());

    return NextResponse.json({
      conversations: list,
      contacts: list,
    });
  } catch (error) {
    console.error("Messages fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
