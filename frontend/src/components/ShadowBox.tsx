//TODO: Optimise to use everywhere

export default (props: React.HTMLProps<HTMLDivElement>) => (
  <div {...props}>
    <div className="rounded-12 shadow-md bg-light-foreground dark:bg-dark-foreground p-4 w-full h-full min-w-fit">
      {props.children}
    </div>
  </div>
);
