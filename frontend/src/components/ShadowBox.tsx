import React from "react";

export default React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(({
                                                                                    className,
                                                                                    ...props
                                                                                  }, forwardedRef) => (
  <div
    ref={forwardedRef}
    className={`${className ?? ''} rounded-12 shadow-md bg-light-foreground dark:bg-dark-foreground p-4 flex flex-col`} {...props}>
  </div>
));
