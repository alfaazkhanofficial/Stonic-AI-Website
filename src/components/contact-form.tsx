"use client";
import { useState } from "react";

const TOPICS = ["General question", "Support", "Security report", "Licensing", "Press"];

/** Opens the visitor's own email app with the message prefilled. Nothing is sent to or stored by the website. */
export function ContactForm({ email }: { email: string }) {
  const [sent, setSent] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const val = (k: string) => String(f.get(k) ?? "").slice(0, 4000);
        const subject = `[${val("topic")}] ${val("name")}`.slice(0, 200);
        const body = `${val("message")}\n\n— ${val("name")} (${val("from")})`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
    >
      <div className="field">
        <label htmlFor="name">Your name</label>
        <input
          className="input"
          id="name"
          name="name"
          required
          maxLength={100}
          autoComplete="name"
        />
      </div>
      <div className="field">
        <label htmlFor="from">Your email</label>
        <input
          className="input"
          id="from"
          name="from"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
        />
      </div>
      <div className="field">
        <label htmlFor="topic">Topic</label>
        <select className="input" id="topic" name="topic">
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea className="input" id="message" name="message" required maxLength={4000} />
      </div>
      <button className="btn primary" type="submit">
        Open in my email app
      </button>
      <p className="hint-text" role="status">
        {sent
          ? "Your email app should have opened. If it didn't, copy the address shown on this page and email us directly."
          : "This opens your email app with the message ready to send. Nothing is stored on this website."}
      </p>
    </form>
  );
}
