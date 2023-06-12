import React, {InputHTMLAttributes, useState} from "react";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/24/outline";
import {twMerge} from "tailwind-merge";

const borderClasses = 'border-2 rounded-lg border-gray-neutral focus-within:border-neutral-800 dark:focus-within:border-neutral-300';
const inputClasses = "px-2 py-1.5 rounded-lg bg-transparent outline-none grow";

const BasicInput = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({
                                                                                                className,
                                                                                                ...props
                                                                                              }, forwardedRef) => {
  return <input {...props}
                ref={forwardedRef}
                className={twMerge(inputClasses, borderClasses, className)}
  />
});

const PasswordInput = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({
                                                                                                   className,
                                                                                                   ...props
                                                                                                 }, forwardedRef) => {
  const [hidden, setHidden] = useState(true);

  const toggleHidden = () => setHidden((prev) => !prev);

  return <div className={twMerge(borderClasses, `flex items-center justify-between`)}>
    <input {...props} type={hidden ? 'password' : 'text'} className={twMerge(inputClasses, className)}
           ref={forwardedRef}/>
    <button type="button" className="ml-auto rounded-lg p-2" onClick={toggleHidden}>
      {
        hidden ? <EyeIcon className="h-5"/> : <EyeSlashIcon className="h-5"/>
      }
    </button>
  </div>
});

const ConfigInput = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({
                                                                                                 className,
                                                                                                 ...props
                                                                                               }, forwardedRef) => {
  return <BasicInput {...props}
                     ref={forwardedRef}
                     className={twMerge("form-input block rounded-md disabled:cursor-not-allowed disabled:text-gray-neutral/80 disabled:bg-gray-neutral/10 dark:disabled:bg-gray-neutral/5 invalid:dark:bg-brand-red/20 invalid:bg-brand-red/20 border-none py-2 bg-light-midground dark:bg-dark-midground", className)}
  />
});

export default BasicInput;
export {PasswordInput, ConfigInput};