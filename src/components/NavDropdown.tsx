"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/lib/i18n/navigation";

export default function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isActive = items.some((item) => item.href === pathname);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1 border-b-2 pb-1 text-sm font-medium ${
          isActive
            ? "border-orange-500 text-orange-500"
            : "border-transparent text-forest-950/70 hover:text-forest-950"
        }`}
      >
        {label}
        <svg
          viewBox="0 0 24 24"
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <ul
          role="menu"
          className="absolute left-0 top-full z-10 mt-3 min-w-52 rounded-lg border border-forest-950/10 bg-white py-2 shadow-lg"
        >
          {items.map((item) => (
            <li key={item.label} role="none">
              <Link
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-sm ${
                  item.href === pathname
                    ? "font-medium text-orange-500"
                    : "text-forest-950/70 hover:bg-forest-950/5 hover:text-forest-950"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
