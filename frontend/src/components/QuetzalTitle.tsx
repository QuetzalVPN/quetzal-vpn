import logo from '../assets/logo.svg';

export default (props: React.HTMLProps<HTMLDivElement>) => (
  <div {...props}>
    <div className="flex gap-2 items-center">
      <img src={logo} className="h-10" />
      <h2 className="text-2xl">QuetzalVPN</h2>
    </div>
  </div>
);
