//TODO: Optimise to use everywhere

export default (props: React.HTMLProps<HTMLDivElement>) => (
  <div className="rounded-12 shadow-md bg-foreground p-4">{props.children}</div>
);
