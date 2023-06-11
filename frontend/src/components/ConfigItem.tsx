import InfoTooltip from "./InfoTooltip";
import {PropsWithChildren} from "react";
import {twMerge} from "tailwind-merge";

interface ConfigItemProps {
  label: string;
  id?: string;
  info: string;
  warning?: string;
  className?: string;
}

export default ({label, id, info, warning, children, className}: PropsWithChildren<ConfigItemProps>) => <div
  className={twMerge("flex flex-col gap-1", className)}>
  <div className="flex items-center justify-between gap-2">
    <label htmlFor={id} className="font-lexend text-md">{label}</label>
    <InfoTooltip info={info} warning={warning} className="text-center -left-32 w-72"/>
  </div>
  {children}
</div>