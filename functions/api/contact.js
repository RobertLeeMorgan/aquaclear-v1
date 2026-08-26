import { Resend } from "resend";

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.formData();

    if (env.PUBLIC_ENVIRONMENT === "production") {
      const token = data.get("cf-turnstile-response");

      if (typeof token !== "string" || !token) {
        return new Response(
          JSON.stringify({ ok: false, error: "Missing turnstile token" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            secret: env.TURNSTILE_SECRET_KEY,
            response: token,
          }),
        },
      );

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        return new Response(
          JSON.stringify({ ok: false, error: "Bot verification failed" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const source = String(data.get("source") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (name.length < 2 || name.length > 100) {
      throw new Error("Invalid name");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error("Invalid email");
    }

    if (phone && phone.length > 20) {
      throw new Error("Invalid phone");
    }

    if (source && (source.length < 2 || source.length > 100)) {
      throw new Error("Invalid source");
    }

    if (message.length < 10 || message.length > 2000) {
      throw new Error("Invalid message");
    }

    const resend = new Resend(env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: `${site.name} <onboarding@resend.dev>`,
      to: site.email,
      replyTo: `<${email}>`,
      template: {
        id: site.emailTemplate,
        variables: {
          name,
          email,
          phone,
          source,
          message,
        },
      },
    });
    if (error) {
      console.error(error);

      return new Response(
        JSON.stringify({
          ok: false,
          error: "Failed to send email.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}