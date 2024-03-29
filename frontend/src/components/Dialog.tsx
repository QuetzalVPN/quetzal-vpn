import React, { ReactNode } from "react";
import { Dialog } from "@headlessui/react";
import ShadowBox from "./ShadowBox";

interface DialogProps {
  open?: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
  backdrop?: boolean;
  fullScreen?: boolean;
  className?: string;
  onClose: () => void;
}

export default ({ open, onClose, title, backdrop, className, fullScreen, description, children }: DialogProps) =>
  <Dialog open={open} onClose={onClose}>
    {(backdrop ?? true) &&
      <div className="fixed inset-0 bg-black/20 dark:bg-black/50" aria-hidden={true} />
    }
    <Dialog.Panel as={ShadowBox}
                  className={`${className} fixed z-[100] ${ fullScreen ? 'top-0 left-0 rounded-none w-screen h-screen flex flex-col' :
                    'top-[50%] left-[50%] -translate-x-center-50 -translate-y-center-50'}`}>
      <Dialog.Title as="h2" className="text-xl">
        {title}
      </Dialog.Title>
      <Dialog.Description className="text-gray-neutral mb-4">
        {description}
      </Dialog.Description>
      {children}
    </Dialog.Panel>
  </Dialog>