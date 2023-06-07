import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { HTMLAttributes } from "react";
import { twJoin } from "tailwind-merge";

interface SearchbarProps {
  className?: string;
  onChange?: (value: string) => void;
  value?: string;
}

export default ({ className, onChange, value }: SearchbarProps) => <div
  className={twJoin("flex rounded-xl bg-light-midground dark:bg-dark-midground shadow-inner focus-within:outline outline-2 outline-brand-green", className)}>
  <input type="text" placeholder="Search" value={value} onChange={e => onChange?.(e.target.value)}
         className="bg-transparent w-48 min-w-[100px] py-1 px-3 outline-none" />
  <button type="submit"
          className="hidden sm:inline h-full z-10 aspect-square p-3 shadow-glow shadow-brand-green/60 bg-brand-green rounded-xl hover:bg-brand-green-light focus:bg-brand-green-light">
    <MagnifyingGlassIcon className="h-5 text-light-text" />
  </button>
</div>