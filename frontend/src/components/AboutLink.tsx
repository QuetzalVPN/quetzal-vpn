import {
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import NavButton from "./NavButton";

interface LinkProps {
  collapsed?: boolean;
}

export default ({ collapsed }: LinkProps) => (
    <a
      className="flex gap-1 items-center justify-center text-gray-neutral hover:underline"
      href="https://quetzal-vpn.dev"
      target="_blank"
    >
      {collapsed ? (
        <InformationCircleIcon className="h-6 stroke-inherit " />
      ) : (
        <>
          <p>About Quetzal</p>
          <ArrowTopRightOnSquareIcon className="h-4" />
        </>
      )}
    </a>
);
