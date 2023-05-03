export default ({className, ...props}: React.HTMLProps<HTMLDivElement> & { centered?: boolean }) => (
  <div
    className={`${className} rounded-12 shadow-md bg-light-foreground dark:bg-dark-foreground p-4 flex flex-col`} {...props}>
  </div>
);
