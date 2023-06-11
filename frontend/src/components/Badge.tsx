import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div {...props}
       className={twMerge("px-3 py-0.5 rounded-full bg-brand-green text-light-text inline-flex", className)} />
);