import * as Dialog from '@radix-ui/react-dialog';
import React, {ReactNode} from "react";

interface DialogProps {
  triggerElement: ReactNode;
  title: string;
  description?: string;
  closeElement?: ReactNode;
  children: ReactNode;
}

// TODO: Fix dialog, currently showing some ref error (most likely because of weird interaction form radix and react-router-dom)
export default ({triggerElement, title, description, closeElement, children}: DialogProps) => <Dialog.Root>
  {/*<Dialog.Trigger asChild>{triggerElement}</Dialog.Trigger>*/}
  {/*<Dialog.Portal>*/}
  {/*  <Dialog.Overlay className="bg-black/50q data-[state=open]:animate-showDialogOverlay fixed inset-0"/>*/}
  {/*  <Dialog.Content*/}
  {/*    className="bg-light-foreground dark:bg-dark-foreground rounded-xl shadow-lg fixed top-[50%] left-[50%] transform -translate-x-center-50 -translate-y-center-50 p-4 w-1/3 h-1/4">*/}
  {/*    <Dialog.Title className="text-lg font-lexend">{title}</Dialog.Title>*/}
  {/*    {description && <Dialog.Description className="text-gray-neutral">{description}</Dialog.Description>}*/}
  {/*    {children}*/}
  {/*    <Dialog.Close>*/}
  {/*      {closeElement ??*/}
  {/*          <Button*/}
  {/*              className="border border-brand-red bg-light-foreground dark:bg-dark-foreground hover:bg-gray-neutral/10 text-brand-red active:bg-gray-neutral/25">Close</Button>}*/}
  {/*    </Dialog.Close>*/}
  {/*  </Dialog.Content>*/}
  {/*</Dialog.Portal>*/}
</Dialog.Root>