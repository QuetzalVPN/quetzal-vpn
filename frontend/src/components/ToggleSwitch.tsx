import {useState} from 'react';
import * as Switch from '@radix-ui/react-switch';

export default () => {
  const [checked, setChecked] = useState(true);

  const toggle = () => {
    setChecked((prevChecked) => !prevChecked);
  };

  return (
    <Switch.Root checked={checked}
                 className="w-[48px] h-[26px] dark:bg-dark-midground relative rounded-full data-[state=checked]:bg-neutral-600 dark:data-[state=checked]:bg-neutral-500 border border-gray-neutral  transition-colors shadow-inner"
                 onClick={toggle}
    >
      <Switch.Thumb
        className="block h-[21px] aspect-square rounded-full bg-brand-green transition-transform will-change-transform translate-x-[2px] data-[state=checked]:translate-x-[23px]"/>
    </Switch.Root>
  );
};
