import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg border border-[var(--ink-soft)]/25 bg-white px-3 py-2 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--magenta)]/40";

export function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-[var(--ink)] mb-1">
        {label}
        {required && <span className="text-[var(--magenta)]"> *</span>}
        {hint && (
          <span className="ml-2 font-normal text-[var(--ink-soft)]">{hint}</span>
        )}
      </span>
      {children}
    </label>
  );
}

/** カードコンテナ */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white shadow-[var(--shadow-pop)] p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button className="pill bg-brand text-white px-5 py-2.5 text-sm font-bold hover:brightness-105 transition">
      {children}
    </button>
  );
}

export function DangerButton({ children }: { children: ReactNode }) {
  return (
    <button className="pill bg-red-50 text-red-600 border border-red-200 px-3 py-2 text-xs font-bold hover:bg-red-100 transition">
      {children}
    </button>
  );
}

export function SectionHeading({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h1 className="font-[family-name:var(--font-rounded)] font-black text-2xl text-[var(--ink)]">
        {title}
      </h1>
      {desc && <p className="mt-1 text-sm text-[var(--ink-soft)]">{desc}</p>}
    </div>
  );
}
