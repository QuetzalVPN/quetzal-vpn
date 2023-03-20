//TODO: Put this in svg element instead of component

export default (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 12" {...props}>
    <path d="M2 0 L2 12 L1 12 Q0 12 0 11 L0 1 Q0 0 1 0 L2 0" />
  </svg>
);
