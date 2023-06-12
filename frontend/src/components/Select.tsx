import {Listbox, Transition} from "@headlessui/react";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/24/outline";
import {Fragment} from "react";
import {SelectOption} from "./AutocompleteSelect";
import {twMerge} from "tailwind-merge";

interface SelectProps {
  disabled?: boolean;
  value: SelectOption;
  onChange: (value: SelectOption) => void;
  options: SelectOption[];
  className?: string;
}

export default ({options, disabled, value, className, onChange}: SelectProps) =>
  <Listbox value={value} onChange={onChange} disabled={disabled}>
    <div className={twMerge("relative", className)}>
      <Listbox.Button
        className={`w-full flex gap-4 justify-between items-center rounded-md ${disabled ? 'bg-gray-neutral/10 dark:bg-gray-neutral/5 text-gray-neutral/80' : 'bg-light-midground dark:bg-dark-midground'} py-2 pl-3 pr-1`}>
        <span>{value.name}</span>
        <ChevronUpDownIcon className="h-5" aria-hidden={true}/>
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options
          className="absolute z-[90] w-full mt-2 rounded-md bg-light-foreground border border-gray-neutral/30 dark:bg-dark-midground overflow-hidden">
          {options.map((option) => (
            <Listbox.Option key={option.id} value={option}
                            className={({active}) => `relative select-none py-1.5 pl-8 pr-4 ${active ? 'bg-brand-green/10' : ''}`}>
              {({selected}) => <>
                {selected &&
                    <span className="absolute inset-y-0 pl-2 flex items-center left-0"><CheckIcon
                        className="text-brand-green h-5"/></span>}
                <span>{option.name}</span>
              </>}
            </Listbox.Option>
          ))
          }
        </Listbox.Options>
      </Transition>
    </div>
  </Listbox>