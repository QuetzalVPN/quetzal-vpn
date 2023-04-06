//TODO: Optimise to use everywhere

export default (props: React.HTMLProps<HTMLDivElement>) => (
  <div {...props}>
    <div className="rounded-12 shadow-md bg-light-foreground dark:bg-dark-foreground p-4">
      {props.children}
    </div>
  </div>
);
