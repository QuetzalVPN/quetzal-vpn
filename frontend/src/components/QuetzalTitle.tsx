import logo from "../assets/quetzal.png";

interface TitleProps {
  collapsed?: boolean;
}

export default ({
                  className,
                  collapsed,
                  ...props
                }: React.HTMLProps<HTMLDivElement> & TitleProps) => (
  <div {...props} className={`${className} flex ${!collapsed ? "gap-2" : ""} items-center"`}>
    <img src={logo} className="h-10" />
    <div className={`grid transition-[grid-template-columns] ${collapsed ? "grid-cols-[0fr]" : "grid-cols-[1fr]"}`}>
      <h2 className={`text-2xl overflow-hidden transition-all ${collapsed ? "opacity-0" : ""}`}>QuetzalVPN</h2>
    </div>
  </div>
);
