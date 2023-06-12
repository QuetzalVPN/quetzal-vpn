import InfoTooltip from "./InfoTooltip";
import {Combobox, Transition} from "@headlessui/react";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/24/outline";
import {Fragment, useEffect, useState} from "react";
import ShadowBox from "./ShadowBox";
import * as fuzzysort from "fuzzysort";

export interface SelectOption {
  id: number;
  name: string;
  value: any;
}

interface AutocompleteSelectProps {
  value: SelectOption;
  onChange: (value: SelectOption) => void;
  options: SelectOption[];
}

export default ({
                  value,
                  onChange,
                  options
                }: AutocompleteSelectProps) => {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(options);

  useEffect(() => {
    setFiltered(fuzzysort.go(query, options, {
      key: 'name',
      all: true
    }).map(({obj}) => obj));
  }, [query, options]);

  // useEffect(() => {
  //   if (typeof objKey === 'string') {
  //     const filteredOptions = fuzzysort.go(query, options, {
  //       key: objKey,
  //       all: true
  //     }).map(({obj}) => obj);
  //     setFiltered(filteredOptions);
  //   } else if (typeof value === 'string' && objKey) {
  //     const filteredOptions = fuzzysort.go(query, options, {
  //       all: true
  //     }).map(result => result.target as T);
  //     setFiltered(filteredOptions);
  //   }
  // }, [query, options]);
  //
  return <Combobox value={value} onChange={onChange}>
    <div className="relative">
      <div
        className="relative flex outline-none items-center justify-between rounded-md bg-light-midground dark:bg-dark-midground py-2 pl-3 pr-1">
        <Combobox.Input
          displayValue={(displayVal: SelectOption) => displayVal.name}
          className="bg-transparent border-none outline-none focus:outline-none p-0"
          onChange={e => setQuery(e.target.value)}
        />
        <Combobox.Button>
          <ChevronUpDownIcon className="h-5" aria-hidden={true}/>
        </Combobox.Button>
      </div>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery('')}
      >
        <Combobox.Options
          as={ShadowBox}
          className="absolute w-full p-0 bg-light-foreground dark:bg-dark-midground border border-gray-neutral/30 mt-2 max-h-60 overflow-auto rounded-md"
        >
          {filtered.map((option, index) => (
            <Combobox.Option
              key={index}
              value={option}
              className={({active}) => `${active ? 'bg-brand-green/10' : ''} relative cursor-default items-center select-none py-1.5 pl-8 pr-4 px-4 list-none`
              }
            >
              {({selected}) => <>
                {selected &&
                    <span className="absolute inset-y-0 flex items-center pl-2 left-0">
                      <CheckIcon className="h-5 text-brand-green"/>
                  </span>}
                <span>{option.name}</span>
              </>}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Transition>
    </div>
  </Combobox>
};