import React from 'react';
import { Linkedin, User } from 'lucide-react';
import { CardSlider } from '@/components/CardSlider';

export type Leader = {
  name: string;
  title: string;
  /** Imported image `.src` (keeps the GitHub Pages sub-path). Omit to show a placeholder portrait. */
  photo?: string;
  photoAlt?: string;
  /** CSS object-position for the photo, to keep the face in frame. */
  photoPosition?: string;
  linkedin?: string;
};

/** One leader: a 3:4 portrait, with the name and title set beneath it. */
export function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <figure className="leader-card">
      <div className="leader-card-frame">
        {leader.photo ? (
          <img
            src={leader.photo}
            alt={leader.photoAlt ?? leader.name}
            loading="lazy"
            draggable={false}
            className="leader-card-img"
            style={{ objectPosition: leader.photoPosition ?? 'center top' }}
          />
        ) : (
          <span className="leader-card-img leader-card-empty">
            <User className="h-12 w-12" strokeWidth={1.5} aria-hidden="true" />
          </span>
        )}
        {leader.linkedin && (
          <a
            href={leader.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${leader.name} on LinkedIn`}
            className="leader-card-link"
          >
            <Linkedin className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </a>
        )}
      </div>
      <figcaption className="leader-card-label">
        <span className="leader-card-name">{leader.name}</span>
        <span className="leader-card-title">{leader.title}</span>
      </figcaption>
    </figure>
  );
}

/** Leader portraits in a horizontal slider with arrow controls. Renders nothing when empty. */
export function LeaderGrid({ leaders }: { leaders: Leader[] }) {
  if (leaders.length === 0) return null;
  return (
    <div className="mt-16 pb-16">
      <CardSlider label="Leadership team" className="leader-slider">
        {leaders.map((l, i) => (
          <LeaderCard key={`${l.name}-${i}`} leader={l} />
        ))}
      </CardSlider>
    </div>
  );
}
