import React from "react";
import { twMerge } from "tailwind-merge";

const VARIANT_CLASSES = {
  default: {
    green: "bg-brand-green hover:bg-brand-green-light focus:bg-brand-green-light active:brightness-110 text-light-text",
    red: "bg-brand-red hover:bg-brand-red-light focus:bg-brand-red-light active:brightness-110 text-light-text",
    neutral: "bg-gray-neutral hover:bg-neutral-300 focus:bg-neutral-300 active:brightness-110 text-current hover:text-light-text focus:text-light-text",
    yellow: "bg-brand-yellow hover:bg-brand-yellow-light focus:bg-brand-yellow-light active:brightness-110 text-light-text",
  },
  outline: {
    green: "bg-none border border-brand-green dark:text-brand-green hover:text-current focus:text-current hover:bg-brand-green/10 focus:bg-brand-green/10",
    red: "bg-none border border-brand-red text-brand-red hover:text-current focus:text-current hover:bg-brand-red/10 focus:bg-brand-red/10",
    neutral: "bg-none border border-gray-neutral text-gray-neutral hover:text-current focus:text-current hover:bg-gray-neutral/20 focus:bg-gray-neutral/20",
    yellow: "bg-none border border-brand-yellow text-brand-yellow hover:text-current focus:text-current hover:bg-brand-yellow/10 focus:bg-brand-yellow/10",
  },
};

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: keyof typeof VARIANT_CLASSES;
  color?: keyof typeof VARIANT_CLASSES['default'];
}

export default React.forwardRef<HTMLButtonElement, ButtonProps>(({
                                                                   className,
                                                                   variant,
                                                                   color,
                                                                   ...props
                                                                 }, forwardedRef) => (
  <button
    {...props}
    ref={forwardedRef}
    className={twMerge(VARIANT_CLASSES[variant ?? 'default'][color ?? 'green'], 'font-lexend px-4 py-2 rounded-lg flex gap-2 justify-center items-center transition active:scale-90' , className)}
  />
));
