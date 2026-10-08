export const NAV = [
  { href: "/product", label: "Product" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/agents", label: "Agents" },
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/gen-1", label: "Gen 1" },
  { href: "/releases", label: "Releases" },
] as const;

export const FOOTER = {
  Product: [
    { href: "/product", label: "Overview" },
    { href: "/capabilities", label: "Capabilities" },
    { href: "/agents", label: "Agents" },
    { href: "/ecosystem", label: "Ecosystem" },
  ],
  Gen1: [
    { href: "/gen-1", label: "STONIC Gen 1" },
    { href: "/download", label: "Download" },
    { href: "/releases", label: "Releases" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/documentation", label: "Documentation" },
  ],
  Company: [
    { href: "/security", label: "Security" },
    { href: "/support", label: "Support" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/license", label: "License" },
  ],
} as const;
