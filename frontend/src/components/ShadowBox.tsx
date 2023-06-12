import React from "react";
import {twMerge} from "tailwind-merge";

export default React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(({
                                                                                    className,
                                                                                    ...props
                                                                                  }, forwardedRef) => (
  <div
    ref={forwardedRef}
    className={twMerge(`rounded-12 shadow-md bg-light-foreground dark:bg-dark-foreground p-4 flex flex-col`, className)} {...props}>
  </div>
));
