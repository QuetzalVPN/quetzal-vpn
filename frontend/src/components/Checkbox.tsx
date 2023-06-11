import {ChangeEventHandler, HTMLAttributes} from "react";
import {twMerge} from "tailwind-merge";

interface CheckboxProps {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  checked?: boolean;
  className?: string;
  id?: string;
}

export default ({className, ...props}: CheckboxProps) =>
  <input type="checkbox"
         {...props}
         className={twMerge("form-checkbox rounded-md border-none p-3 aspect-square bg-light-midground dark:bg-dark-midground checked:bg-brand-green dark:checked:bg-brand-green text-brand-green-light dark:text-brand-green-light", className)}
  />