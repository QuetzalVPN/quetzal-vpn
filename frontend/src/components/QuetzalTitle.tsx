import logo from "../assets/quetzal.png";

interface TitleProps {
  collapsed?: boolean;
}

export default ({
                  className,
                  collapsed,
                  ...props
                }: React.HTMLProps<HTMLDivElement> & TitleProps) => (
  <div {...props} className={`${className} flex ${!collapsed ? 'gap-2' : ''} items-center"`}>
      <img src={logo} className="h-10" />
        <div className={`nav-extra ${collapsed ? 'collapsed' : ''}`} >
          <h2 className="text-2xl">QuetzalVPN</h2>
        </div>
  </div>
);
