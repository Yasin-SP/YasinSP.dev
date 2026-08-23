// Contact / social links shown in the footer's "Connect" column and
// wherever else socialLinks is used. Edit the values below with your real
// profiles, then commit — nothing here needs to be secret.
//
// - `type` must match a key in the iconMap in src/components/Footer.jsx
//   (currently: "email", "github", "linkedin", "telegram").
// - `label` is what's displayed next to the icon.
// - `href` is the full clickable URL. For Telegram use your public
//   username: https://t.me/yourusername

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || "yasinsp.dev@gmail.com";

export const socialLinks = [
  ...(contactEmail ? [{ label: "Email", href: `mailto:${contactEmail}`, type: "email" }] : []),
  { label: "GitHub", href: "https://github.com/Yasin-SP", type: "github" },
  // { label: "LinkedIn", href: "https://linkedin.com/in/yourusername", type: "linkedin" },
  { label: "Telegram", href: "https://t.me/YasinSP", type: "telegram" },
];
