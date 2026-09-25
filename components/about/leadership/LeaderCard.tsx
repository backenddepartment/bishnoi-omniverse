import React from 'react';
import { Linkedin } from 'lucide-react';
import { FadeIn } from '@/components/FadeIn';

export type Leader = {
  name: string;
  title: string;
  /** Imported image `.src` (keeps the GitHub Pages sub-path). */
  photo: string;
  photoAlt: string;
  linkedin?: string;
};

/** One leader card: round photo, name, title and an optional LinkedIn link. */
export function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <div className="h-full rounded-2xl border border-[#e4ddd0] bg-white p-8 text-center">
      <img
        src={leader.photo}
        alt={leader.photoAlt}
        loading="lazy"
        className="mx-auto mb-5 h-32 w-32 rounded-full bg-paper-2 object-cover object-top"
      />
      <h3 className="font-poppins text-lg font-semibold text-ink">{leader.name}</h3>
      <p className="mt-1 text-sm font-medium text-accent">{leader.title}</p>
      {leader.linkedin && (
        <a
          href={leader.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${leader.name} on LinkedIn`}
          className="mt-4 inline-flex text-accent hover:opacity-80"
        >
          <Linkedin className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

/** Three-column grid of leader cards (one column on phones). Renders nothing when empty. */
export function LeaderGrid({ leaders }: { leaders: Leader[] }) {
  if (leaders.length === 0) return null;
  return (
    <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {leaders.map((l, i) => (
        <FadeIn key={l.name} delay={i * 0.08}>
          <LeaderCard leader={l} />
        </FadeIn>
      ))}
    </div>
  );
}
