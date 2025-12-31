import Link from "next/link";

const steps = [
  {
    title: "Set Webhook",
    content:
      "Use the Telegram Bot API to point your bot to this deployment. Apply the secret token to secure inbound calls."
  },
  {
    title: "Grant Secrets",
    content:
      "Configure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_SECRET_TOKEN` in your Vercel project (or locally via `.env.local`)."
  },
  {
    title: "Integrate Logic",
    content:
      "Customize `app/api/telegram/route.ts` to expand how the bot replies to commands and messages."
  }
];

export default function Home() {
  return (
    <main>
      <div className="grid" style={{ gap: "2.5rem" }}>
        <header className="grid card">
          <span className="tag">Telegram Bot</span>
          <h1 style={{ margin: 0, fontSize: "clamp(2.4rem, 5vw, 3.5rem)" }}>
            Your Next.js powered Telegram agent is ready.
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: "1.05rem" }}>
            This deployment exposes a secure webhook endpoint that receives
            Telegram updates and replies with contextual responses. Tailor the
            bot&apos;s behaviour and roll out instantly via Vercel.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link className="button" href="https://core.telegram.org/bots/api">
              Telegram Bot API
            </Link>
            <a
              className="button"
              href="https://vercel.com/docs/projects/environment-variables"
            >
              Configure Secrets
            </a>
          </div>
        </header>

        <section className="grid two">
          {steps.map((step) => (
            <article key={step.title} className="card">
              <h2 style={{ marginTop: 0 }}>{step.title}</h2>
              <p style={{ marginBottom: 0, opacity: 0.85 }}>{step.content}</p>
            </article>
          ))}
        </section>

        <section className="card">
          <h2 style={{ marginTop: 0 }}>Environment Variables</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: "1rem" }}>
              <code>TELEGRAM_BOT_TOKEN</code>
              <p style={{ margin: "0.4rem 0 0", opacity: 0.8 }}>
                Bot token from <code>@BotFather</code>, used to send replies and
                configure the webhook.
              </p>
            </li>
            <li>
              <code>TELEGRAM_SECRET_TOKEN</code>
              <p style={{ margin: "0.4rem 0 0", opacity: 0.8 }}>
                A secret string shared with Telegram to validate webhook
                requests via the{" "}
                <code>X-Telegram-Bot-Api-Secret-Token</code> header.
              </p>
            </li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ marginTop: 0 }}>Webhook Reference</h2>
          <p style={{ opacity: 0.85 }}>
            Point your bot to{" "}
            <code>
              {`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://agentic-a7debf5f.vercel.app"}/api/telegram`}
            </code>{" "}
            via the <code>setWebhook</code> method and include{" "}
            <code>secret_token</code> with your secret value.
          </p>
          <pre
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              borderRadius: 12,
              padding: "1.5rem",
              overflowX: "auto"
            }}
          >
            <code>
              {String.raw`curl -X POST \
  https://api.telegram.org/bot<TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://agentic-a7debf5f.vercel.app/api/telegram",
    "secret_token": "<SECRET>"
  }'`}
            </code>
          </pre>
          <p style={{ opacity: 0.85 }}>
            Replace the placeholders with your bot&apos;s token and the matching
            secret.
          </p>
        </section>
      </div>
    </main>
  );
}
