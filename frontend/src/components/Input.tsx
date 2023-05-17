import {InputHTMLAttributes, useEffect, useState} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  initialValue?: any;
  value?: any;
  setValue?: (value: any) => void;
  validator?: (value: any) => boolean;
}

export default ({
                  validator,
                  value,
                  initialValue,
                  setValue,
                  className: propsClassName,
                  ...props
                }: InputProps) => {
  const [valid, setValid] = useState<boolean>(!props.required);

  useEffect(() => {
    if (validator) {
      setValid(validator(value));
    }
  }, [value]);

  return (
    <input
      {...props}
      className={`rounded-lg py-1.5 px-2 outline-none border-2 transition-[border] bg-transparent ${
        value == initialValue
          ? 'border-gray-neutral'
          : valid
            ? initialValue ? 'border-sky-400' : ''
            : 'border-brand-red'
      } ${
        valid ? 'focus:border-brand-green' : 'border-brand-red'
      } ${propsClassName}} `}
      value={value}
      onChange={setValue ? ({target}) => setValue(target.value) : undefined}
    />
  );
};
