import logo from '../assets/quetzal.png';

interface TitleProps {
  collapsed?: boolean;
}

export default ({
  collapsed,
  ...props
}: React.HTMLProps<HTMLDivElement> & TitleProps) => (
  <div {...props}>
    <div className="flex gap-2 items-center">
      <img src={logo} className="h-10" />
      {!collapsed && <h2 className="text-2xl">QuetzalVPN</h2>}
    </div>
  </div>
);
