import {InputHTMLAttributes, useState} from "react";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/24/outline";

const borderClasses = 'border-2 rounded-lg border-gray-neutral focus-within:border-neutral-800 dark:focus-within:border-neutral-300';
const inputClasses = "px-2 py-1.5 rounded-lg bg-transparent outline-none grow";

export default ({className, ...props}: InputHTMLAttributes<HTMLInputElement>) => {
  return <input {...props}
                className={`${className} ${borderClasses} ${inputClasses}`}
  />
}

const PasswordInput = ({className, ...props}: InputHTMLAttributes<HTMLInputElement>) => {
  const [hidden, setHidden] = useState(true);

  const toggleHidden = () => setHidden((prev) => !prev);

  return <div className={`${borderClasses} flex items-center password-toggle`}>
    <input {...props} type={hidden ? 'password' : 'text'} className={`${className} ${inputClasses}`}/>
    <button type="button" className="ml-auto rounded-lg p-2" onClick={toggleHidden}>
      {
        hidden ? <EyeIcon className="h-5"/> : <EyeSlashIcon className="h-5"/>
      }
    </button>
  </div>
}

export {PasswordInput};