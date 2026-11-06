type P = { className?: string };

export const InstagramIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const TikTokIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M16.6 3c.3 2.3 1.7 3.9 4 4.1v3.1c-1.5.1-2.8-.4-4-1.2v6.2c0 3.6-2.6 5.8-5.7 5.8-3.3 0-5.6-2.6-5.4-5.7.2-3 2.8-5.3 6-4.9v3.2c-1.5-.3-2.8.6-2.9 1.9-.1 1.3.9 2.4 2.2 2.4 1.4 0 2.3-1 2.3-2.5V3h3.5z" />
  </svg>
);

export const WhatsAppIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 2.2A9.7 9.7 0 0 0 3.7 16.9L2.3 21.8l5-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.4z" />
  </svg>
);
