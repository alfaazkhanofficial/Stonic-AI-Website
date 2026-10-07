import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@/styles/globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrollFX } from "@/components/scroll-fx";
import { isProduction, siteUrl } from "@/lib/env";
import { getContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, settings } = await getContent();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: seo.title, template: `%s · ${settings.siteName}` },
    description: seo.description,
    applicationName: settings.siteName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: settings.siteName,
      title: seo.title,
      description: seo.description,
      url: siteUrl,
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
    // Non-production environments must never be indexed.
    robots: isProduction ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = { themeColor: "#04060d", colorScheme: "dark" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { announcement, settings } = await getContent();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: settings.siteName,
        url: siteUrl,
        logo: `${siteUrl}/brand/stonic-s-symbol-512.png`,
      },
      { "@type": "WebSite", name: settings.siteName, url: siteUrl },
    ],
  };
  return (
    <html lang="en">
      <head>
        {/* Enables the JS-gated reveal states; without JS all content stays visible. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ScrollFX />
        {announcement.enabled && announcement.text && (
          <div className="announce" role="region" aria-label="Announcement">
            {announcement.href ? (
              <a href={announcement.href}>{announcement.text}</a>
            ) : (
              announcement.text
            )}
          </div>
        )}
        <Header />
        <main id="main">{children}</main>
        <Footer siteName={settings.siteName} supportEmail={settings.supportEmail} />
      </body>
    </html>
  );
}
