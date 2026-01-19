import { FaLinkedin, FaGithub, FaBriefcase } from 'react-icons/fa';

const LINKS = [
  {
    href: 'https://www.linkedin.com/in/wwisse/',
    icon: FaLinkedin,
    label: 'LinkedIn',
  },
  {
    href: 'https://github.com/WouterWisse',
    icon: FaGithub,
    label: 'GitHub',
  },
];

interface SocialLinksProps {
  isDark?: boolean;
  color?: string;
  onWorkClick?: () => void;
  isWorkActive?: boolean;
}

export function SocialLinks({ isDark = false, color, onWorkClick, isWorkActive = false }: SocialLinksProps) {
  const iconColor = color || (isDark ? '#a0a0b0' : '#64748b');
  const bgColor = isDark ? '#2a2040' : '#f0f0f0';

  return (
    <ul className="flex gap-3 md:gap-4">
      {LINKS.map(({ href, icon: Icon, label }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-all duration-500 hover:scale-110"
            style={{
              backgroundColor: bgColor,
              color: iconColor,
            }}
          >
            <Icon className="h-4 w-4 md:h-5 md:w-5" />
          </a>
        </li>
      ))}
      {onWorkClick && (
        <li>
          <button
            onClick={onWorkClick}
            aria-label="Work"
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-all duration-500 hover:scale-110"
            style={{
              backgroundColor: isWorkActive ? iconColor : bgColor,
              color: isWorkActive ? bgColor : iconColor,
            }}
          >
            <FaBriefcase className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </li>
      )}
    </ul>
  );
}
