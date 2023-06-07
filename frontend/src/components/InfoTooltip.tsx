import { Popover, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { Fragment } from "react";

export default ({ info, className }: { info: string, className?: string }) => <Popover
  className="relative inline w-fit">
  <Popover.Button as="button"
                  className="rounded-full p-2 aspect-square flex justify-center items-center bg-gray-neutral/30 dark:bg-dark-midground text-light-text dark:text-dark-text">
    <span className="text-lexend text-sm">?</span>
  </Popover.Button>
  <Transition
    as={Fragment}
    enter="transition ease-out duration-200"
    enterFrom="opacity-0 translate-y-1"
    enterTo="opacity-100 translate-y-0"
    leave="transition ease-in duration-150"
    leaveFrom="opacity-100 translate-y-0"
    leaveTo="opacity-0 translate-y-1"
  >
    <Popover.Panel
      className={twMerge("info-bg-image absolute top-8 -left-1/2 z-[100] w-[200px] bg-light-midground dark:bg-dark-midground py-1 px-2 shadow-sm rounded", className)}>
      <p>{info}</p>
    </Popover.Panel>
  </Transition>
</Popover>;