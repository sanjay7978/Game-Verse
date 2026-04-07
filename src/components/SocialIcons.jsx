const socials = [
  {
    label: "Discord",
    href: "https://discord.com",
    color: "#7c8cff",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20.3 4.37A16.7 16.7 0 0 0 16.2 3a11.5 11.5 0 0 0-.53 1.08 15.5 15.5 0 0 0-4.68 0A11.3 11.3 0 0 0 10.47 3a16.6 16.6 0 0 0-4.1 1.37C3.8 8.24 3.1 12 3.45 15.72A16.8 16.8 0 0 0 8.48 18.2c.4-.56.76-1.15 1.07-1.77-.58-.22-1.13-.5-1.64-.82.14-.1.27-.21.4-.32 3.17 1.49 6.61 1.49 9.75 0l.4.32c-.5.33-1.05.6-1.64.82.31.62.67 1.21 1.07 1.77a16.7 16.7 0 0 0 5.04-2.48c.42-4.3-.72-8.03-3.63-11.35M9.95 13.45c-.95 0-1.73-.87-1.73-1.94s.76-1.94 1.73-1.94 1.75.87 1.73 1.94c0 1.07-.77 1.94-1.73 1.94m4.1 0c-.96 0-1.73-.87-1.73-1.94s.76-1.94 1.73-1.94 1.74.87 1.73 1.94c0 1.07-.77 1.94-1.73 1.94"
        />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    color: "#ff5dd6",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm11.5 1.5a1 1 0 1 1-1 1 1 1 0 0 1 1-1M12 7a5 5 0 1 1-5 5 5 5 0 0 1 5-5m0 2a3 3 0 1 0 3 3 3 3 0 0 0-3-3"
        />
      </svg>
    ),
  },
  {
    label: "Twitter X",
    href: "https://x.com",
    color: "#00f0ff",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M18.9 2H22l-6.77 7.74L23 22h-6.1l-4.78-6.26L6.64 22H3.53l7.24-8.28L1 2h6.26l4.32 5.7zm-1.07 18h1.72L6.33 3.9H4.49z"
        />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com",
    color: "#9fbeff",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42a3.17 3.17 0 0 0-1.34-1.75c-1.1-.76.08-.74.08-.74a2.5 2.5 0 0 1 1.82 1.23 2.54 2.54 0 0 0 3.48 1 2.54 2.54 0 0 1 .76-1.6c-2.67-.31-5.48-1.34-5.48-5.95a4.66 4.66 0 0 1 1.24-3.23 4.34 4.34 0 0 1 .12-3.18s1-.33 3.3 1.23a11.43 11.43 0 0 1 6 0c2.28-1.56 3.29-1.23 3.29-1.23a4.34 4.34 0 0 1 .12 3.18 4.65 4.65 0 0 1 1.24 3.23c0 4.62-2.82 5.64-5.5 5.94a2.84 2.84 0 0 1 .81 2.2v3.27c0 .32.22.7.83.58A12 12 0 0 0 12 .5"
        />
      </svg>
    ),
  },
];

function SocialIcons() {
  return (
    <div className="footer-socials">
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          className="footer-social-link"
          style={{ "--social-color": social.color }}
          aria-label={social.label}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}

export default SocialIcons;
