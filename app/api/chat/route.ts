import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = token ? (verifyToken(token) as any) : null;

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const role = decoded?.role || "guest";
    const roleContext =
      role === "FARMER"
        ? `The user is a FARMER on the platform. Help them with:
- Listing and managing their crops/products
- Order management (accepting, shipping, tracking)
- Agricultural advice (crop rotation, pest control, soil health)
- Inventory management and stock alerts
- Pricing strategies and market trends
- Revenue analytics and growth tips
- Crop calendar guidance (Kharif, Rabi, Zaid seasons)
- Organic certification and sustainable farming`
        : role === "BUYER"
        ? `The user is a BUYER/BUSINESS on the platform. Help them with:
- Finding the right products and farmers
- Placing orders and payment options
- Order tracking and delivery status
- Product quality assessment tips
- Bulk purchasing guidance
- Seasonal availability of crops
- Comparing products and prices
- Wishlist management and reordering`
        : `The user is not logged in. Help them understand the platform, guide them to sign up or log in, and answer general agriculture questions.`;

    const systemPrompt = `You are FarmConnect AI Assistant — an expert agricultural advisor for India's premier B2B agricultural marketplace that connects farmers directly with businesses and consumers.

## Your Role
${roleContext}

## Core Capabilities
- Expert knowledge of Indian agriculture, monsoon patterns, MSP (Minimum Support Price), APMC markets
- Farming tips for all seasons: Kharif (June-Oct), Rabi (Oct-Mar), Zaid (Mar-June)
- Knowledge of organic farming, IPM (Integrated Pest Management), soil health
- Understanding of Indian states, climate zones, and regional crop specialties
- Basic platform support: navigating FarmConnect, orders, payments, profiles
- Market intelligence: crop pricing trends, supply-demand insights

## Guidelines
- Be friendly, knowledgeable, and professional
- Use Indian context (₹ currency, Indian crops, states, mandi prices)
- Give precise, actionable advice
- If asked about specific account details (passwords, payments), guide to the dashboard or support
- Use markdown formatting (bold, lists) for readability
- Keep responses concise (150-300 words) unless detailed explanation is warranted
- When unsure, acknowledge it honestly

${decoded ? `User: ${decoded.name || "User"} (${decoded.role}, ID: ${decoded.id})` : "User: Guest (not logged in)"}`;

    const geminiMessages = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [
          {
            text:
              role === "FARMER"
                ? "Namaste! I'm your FarmConnect AI Assistant. I can help you manage your farm listings, track orders, provide crop advice, and analyze your revenue. What would you like help with today? 🌾"
                : role === "BUYER"
                ? "Namaste! I'm your FarmConnect AI Assistant. I can help you find the best produce, track orders, compare prices, and get the freshest deals. How can I assist you today? 🛒"
                : "Namaste! Welcome to FarmConnect — India's premier agricultural marketplace. I can help you learn about our platform, find fresh produce, or answer agriculture questions. How can I help? 🌱",
          },
        ],
      },
      ...messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, I couldn't generate a response. Please try again.";

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
