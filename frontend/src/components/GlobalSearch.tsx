import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import {useState} from 'react';

export default ({className, ...props}: React.HTMLProps<HTMLInputElement>) => {
  const [open, setOpen] = useState(false);

  const closeModal = () => setOpen(false);

  return (
    <>
      <div
        className={`relative bg-light-midground dark:bg-dark-midground rounded-xl inline-block ${
          className ?? ''
        }`}
        onClick={(e) => {
          setOpen(true);
        }}
      >
        <input
          {...props}
          type="search"
          placeholder="Search"
          className="bg-transparent p-3 shadow-inner w-full rounded-xl text-gray-800 dar  k:text-gray-300 outline-none focus:ring-2 ring-brand-green ring-opacity-50 ring-offset-1"
        />
        <button
          className="absolute aspect-square h-full rounded-xl bg-brand-green shadow-glow right-0 top-0 flex items-center justify-center">
          <MagnifyingGlassIcon className="h-5 stroke-light-text"/>
        </button>
      </div>
    </>
  );
};
