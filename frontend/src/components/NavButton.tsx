interface NavButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export default ({ active, ...props }: NavButtonProps) => (
  <button
    {...props}
    style={props.style ? props.style : { padding: '.5rem' }}
    className={`${
      active
        ? ''
        : 'stroke-gray-neutral hover:stroke-gray-700 dark:hover:stroke-gray-400 text-gray-neutral hover:text-gray-700 dark:hover:text-gray-400'
    } rounded-lg`}
  />
);
