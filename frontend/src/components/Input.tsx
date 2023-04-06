import { InputHTMLAttributes, useEffect, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  initialValue: any;
  validator: (value: any) => boolean;
}

export default ({
  validator,
  value: propValue,
  initialValue,
  ...props
}: InputProps) => {
  const [value, setValue] = useState(initialValue);
  const [valid, setValid] = useState<boolean>(!props.required);

  useEffect(() => {
    setValid(validator(value));
  }, [value]);

  // TODO: Allow state to be controlled from parent component

  return (
    <input
      {...props}
      className={`border-2 rounded-lg p-1 outline-none w-48 text-center transition-all bg-transparent ${
        value == initialValue
          ? 'border-gray-neutral'
          : valid
          ? 'border-sky-400'
          : 'border-brand-red'
      } ${valid ? 'focus:border-brand-green' : 'border-brand-red'}`}
      value={value}
      onChange={({ target }) => setValue(target.value)}
    />
  );
};
