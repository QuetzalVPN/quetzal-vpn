export default (props: React.HTMLProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 120 246"
    style={{
      strokeWidth: '12px',
      strokeLinecap: 'round',
      stroke: 'grey',
      fill: 'none',
      transition: '.2s ease-in-out',
    }}
  >
    <path d="M4 4v238m.5-119h106m0-.4-38-38m0 76.8 38-38" />
  </svg>
);
