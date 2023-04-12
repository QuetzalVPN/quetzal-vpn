import Input from './Input';

const IP_REGEX =
  /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/;

interface IPInputProps {
  id: string;
  initialValue: string;
}

export default ({ id, initialValue }: IPInputProps) => (
  <Input
    type="text"
    initialValue={initialValue}
    required
    validator={(value: string) => !!value.match(IP_REGEX)}
    id={id}
  />
);
