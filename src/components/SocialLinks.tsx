import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const LINKS = [
  {
    href: 'https://www.linkedin.com/in/wwisse/',
    icon: FaLinkedin,
    label: 'LinkedIn'
  },
  {
    href: 'https://github.com/WouterWisse',
    icon: FaGithub,
    label: 'GitHub'
  },
  {
    href: 'mailto:hello@wouterwisse.com',
    icon: FaEnvelope,
    label: 'Email'
  },
];

export function SocialLinks() {
  return (
    <ul className="flex justify-center gap-4">
      {LINKS.map(({ href, icon: Icon, label }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            aria-label={label}
            className="flex h-12 w-12 items-center justify-center rounded-full
                       bg-white/20 text-white backdrop-blur-sm
                       transition-all duration-300 hover:bg-white/30 hover:scale-110"
          >
            <Icon className="h-6 w-6" />
          </a>
        </li>
      ))}
    </ul>
  );
}
