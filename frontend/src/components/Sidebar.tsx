import {useSidebarState} from "../hooks/zustand";

export default ({className, ...props}: React.HTMLAttributes<HTMLDivElement>) => {
  const {sidebar: open, setSidebar} = useSidebarState();

  return open ? <div
    className={`${className} shadow-md bg-light-foreground dark:bg-dark-foreground flex flex-col h-screen pt-12 px-8 relative`} {...props}/> : <></>
}