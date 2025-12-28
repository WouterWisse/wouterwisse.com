import type { MonthlyTheme } from '@/types/theme';
import { SocialLinks } from './SocialLinks';

interface ProfileContentProps {
  theme: MonthlyTheme;
}

export function ProfileContent({ theme }: ProfileContentProps) {
  return (
    <div className="text-center text-white">
      <h1 className="mb-3 text-4xl font-bold md:text-5xl lg:text-6xl tracking-tight">
        Wouter Wisse
      </h1>

      <p className="mb-3 text-lg md:text-xl lg:text-2xl font-light text-slate-300">
        Full Stack Developer with 15 years of experience
      </p>

      <p className="mb-6 text-base md:text-lg italic text-slate-400">
        {theme.tagline}
      </p>

      <SocialLinks />
    </div>
  );
}
