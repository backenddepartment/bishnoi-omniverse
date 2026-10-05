import { findCategoryIcon } from '@/lib/catalogIcons';

/** Rounded medical cross with a lifeline across it, for products whose category has no icon. */
const CROSS_PATH =
  'M32 11A5 5 0 0 1 37 6H63A5 5 0 0 1 68 11V30A2 2 0 0 0 70 32H89A5 5 0 0 1 94 37V63' +
  'A5 5 0 0 1 89 68H70A2 2 0 0 0 68 70V89A5 5 0 0 1 63 94H37A5 5 0 0 1 32 89V70' +
  'A2 2 0 0 0 30 68H11A5 5 0 0 1 6 63V37A5 5 0 0 1 11 32H30A2 2 0 0 0 32 30Z';

/**
 * Stand-in artwork for a product without a photo: its category's icon in white on a badge in
 * the hero's orange sweep, so every product in a category shares one recognisable image.
 */
export function CategoryArt({ categoryId, className = '' }: { categoryId: string; className?: string }) {
  const Icon = findCategoryIcon(categoryId);

  if (!Icon) {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true" className={`category-art is-cross ${className}`}>
        <defs>
          <linearGradient id="category-art-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffc400" />
            <stop offset="25%" stopColor="#ff9a0a" />
            <stop offset="55%" stopColor="#f36b21" />
            <stop offset="80%" stopColor="#e8401c" />
            <stop offset="100%" stopColor="#c7331a" />
          </linearGradient>
          <linearGradient id="category-art-gloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={CROSS_PATH} fill="url(#category-art-fill)" />
        <path d={CROSS_PATH} fill="url(#category-art-gloss)" />
        <path className="category-art-lifeline" d="M9 50H38L43 36L49 63L54 43L57 50H91" pathLength={100} />
      </svg>
    );
  }

  return (
    <span aria-hidden="true" className={`category-art is-badge ${className}`}>
      <Icon strokeWidth={1.75} />
    </span>
  );
}
