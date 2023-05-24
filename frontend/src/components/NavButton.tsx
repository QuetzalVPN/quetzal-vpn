import React from "react";

interface NavButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export default React.forwardRef<HTMLButtonElement, NavButtonProps>(({
                                                                      active,
                                                                      className,
                                                                      ...props
                                                                    }, forwardedRef) => (
  <button
    {...props}
    style={props.style ? props.style : {padding: '.5rem'}}
    ref={forwardedRef}
    className={`
    ${className ?? ''}
    ${
      active
        ? ''
        : 'stroke-gray-neutral hover:stroke-gray-700 dark:hover:stroke-gray-400 focus:stroke-gray-700 dark:focus:stroke-gray-400 text-gray-neutral hover:text-gray-700 dark:hover:text-gray-400 focus:text-gray-700 dark:focus:text-gray-400'
    } rounded-lg`}
  />
));
