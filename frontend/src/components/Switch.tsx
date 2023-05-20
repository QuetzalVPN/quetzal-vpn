import React, {Dispatch, SetStateAction} from "react";
import {Switch} from "@headlessui/react";

interface ToggleSwitchProps {
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
  label?: string;
}

export default React.forwardRef<HTMLButtonElement, ToggleSwitchProps>(({enabled, setEnabled, label}, forwardedRef) => {
  return (
    <Switch checked={enabled} onChange={setEnabled}
            className={`group w-[48px] h-[25px] rounded-full ${enabled ? 'bg-brand-green/20' : 'bg-none'} relative border-2 ${enabled ? 'border-brand-green' : 'border-gray-neutral'} transition-colors`}
    >
      {label && <span className="sr-only">{label}</span>}

      <span
        className={`block h-[18px] aspect-square ${enabled ? 'bg-brand-green' : 'bg-gray-neutral'} rounded-full ${enabled ? 'translate-x-[25px]' : 'translate-x-0.5'} transition-all group-hover:shadow-switch group-active:scale-110`}
      />
    </Switch>
  );
});
