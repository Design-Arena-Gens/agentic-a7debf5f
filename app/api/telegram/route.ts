import { NextRequest, NextResponse } from "next/server";
import {
  assertEnvVar,
  sendTelegramMessage,
  TelegramMessage,
  TelegramUpdate
} from "@/lib/telegram";

function isTelegramMessage(payload: unknown): payload is TelegramMessage {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  return (
    "message_id" in payload &&
    "chat" in payload &&
    typeof (payload as TelegramMessage).chat === "object"
  );
}

function extractMessage(update: TelegramUpdate): TelegramMessage | null {
  if ("message" in update && isTelegramMessage(update.message)) {
    return update.message;
  }
  if ("edited_message" in update && isTelegramMessage(update.edited_message)) {
    return update.edited_message;
  }
  return null;
}

function buildReply(message: TelegramMessage): string | null {
  const text = message.text?.trim();
  if (!text) {
    return null;
  }

  if (text.startsWith("/start")) {
    const name = message.from?.first_name ?? "there";
    return [
      `Hey ${name}!`,
      "I'm a Next.js powered Telegram bot and I just received your webhook update.",
      "",
      "Available commands:",
      "• /start - show this welcome message",
      "• /help - learn what I can do",
      "• /echo <text> - mirror back what you send"
    ].join("\n");
  }

  if (text.startsWith("/help")) {
    return [
      "Here’s what I can do right now:",
      "- /start: Show the welcome flow",
      "- /help: Display this cheat sheet",
      "- /echo <text>: Echo any text you provide",
      "",
      "Extend me by editing `app/api/telegram/route.ts`."
    ].join("\n");
  }

  if (text.startsWith("/echo")) {
    const echoPayload = text.replace("/echo", "").trim();
    return echoPayload.length > 0
      ? `🔁 ${echoPayload}`
      : "Send `/echo <your text>` to hear it back.";
  }

  return `You said: "${text}"`;
}

export async function POST(req: NextRequest) {
  const logPrefix = "[telegram-webhook]";

  try {
    const botToken = assertEnvVar("TELEGRAM_BOT_TOKEN");
    const expectedSecret = assertEnvVar("TELEGRAM_SECRET_TOKEN");
    const providedSecret =
      req.headers.get("x-telegram-bot-api-secret-token") ?? "";

    if (providedSecret !== expectedSecret) {
      console.warn(`${logPrefix} invalid secret token`);
      return NextResponse.json(
        { ok: false, description: "Unauthorized" },
        { status: 401 }
      );
    }

    const update = (await req.json()) as TelegramUpdate;
    const message = extractMessage(update);

    if (!message || !message.chat?.id) {
      console.info(`${logPrefix} non-message update processed`);
      return NextResponse.json({ ok: true });
    }

    const reply = buildReply(message);

    if (!reply) {
      console.info(`${logPrefix} no reply generated for message ${message.message_id}`);
      return NextResponse.json({ ok: true });
    }

    await sendTelegramMessage(botToken, {
      chat_id: message.chat.id,
      text: reply
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const description =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`${logPrefix} handler failed`, error);
    return NextResponse.json(
      { ok: false, description },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message:
      "Telegram bot webhook endpoint is alive. Use POST with Telegram updates."
  });
}
