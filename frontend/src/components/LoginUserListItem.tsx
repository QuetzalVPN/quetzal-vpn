import {Disclosure, Transition} from "@headlessui/react";
import {twMerge} from "tailwind-merge";
import {ChevronDownIcon, UserIcon, UserMinusIcon} from "@heroicons/react/24/outline";
import Button from "./Button";
import dayjs from "dayjs";
import Badge from "./Badge";
import {LoginUser, LoginUserLog, LoginUserLogEntry} from "../types/LoginUsers";
import {useDeleteUser, useLoginUserLogs} from "../hooks/useLoginUser";
import LoadingSpinner from "./LoadingSpinner";

const LogTable = ({userId}: { userId: number }) => {
  const userLog = useLoginUserLogs(userId);

  if (userLog.isLoading) {
    return <div className="flex justify-center items-center h-32">
      <LoadingSpinner className="h-12"/>
    </div>;
  } else if (userLog.isError) {
    return <p className="text-brand-red">Error</p>;
  }

  return <table className="w-full xl:w-1/2">
    <thead className="border-b border-gray-neutral/30 font-lexend">
    <tr>
      <th className="px-4 py-2 w-3/6">Timestamp</th>
      <th className="px-4 py-2 w-2/6">Origin</th>
      <th className="px-4 py-2 w-1/6">Result</th>
    </tr>
    </thead>
    <tbody>
    {userLog.data?.logs.slice(-5).map((log: LoginUserLogEntry) => (
      <tr key={log.id} className="odd:bg-gray-neutral/10">
        <td className="text-center py-1">
          {dayjs(log.dateTime).format("HH:mm:ss  -  DD.MM.YYYY")}
        </td>
        <td className="text-center py-1">
          {log.origin}
        </td>
        <td className="text-center py-1">
          <Badge
            className={`aspect-square sm:aspect-auto ${log.successful ? "bg-brand-green text-light-text" : "bg-brand-red text-dark-text"}`}>
           <span className="hidden sm:inline">
             {log.successful ? "Success" : "Failure"}
           </span>
          </Badge>
        </td>
      </tr>
    ))}
    </tbody>
  </table>
};

export default ({user}: { user: LoginUser }) => {
  const deleteUser = useDeleteUser();

  const handleDelete = (user: LoginUser) => {
    deleteUser.mutate(user);
  };

  return <Disclosure>
    {({open}) => (
      <div
        className={`border-2 rounded-lg mb-2 border-gray-neutral/20`}>
        <Disclosure.Button
          as="div"
          className={twMerge("grid grid-cols-8 lg:grid-cols-12 cursor-pointer w-full gap-4 items-center rounded-lg hover:bg-gray-neutral/10 p-1", open && "rounded-b-none bg-neutral-600/10 hover:bg-none")}>
          <div
            className="h-10 ml-4 sm:m-0 justify-self-center grid place-content-center aspect-square rounded-xl bg-gray-neutral/50">
            <UserIcon className="h-6"/>
          </div>
          <p className="ml-1 text-xl col-span-3 lg:col-span-7">{user.username}</p>
          <Button className="col-span-2" variant="outline" color="red" onClick={(e) => {
            e.stopPropagation();
            handleDelete(user);
          }}>
            <UserMinusIcon className="h-5 w-5"/>
            <span className="hidden sm:inline">Delete</span>
          </Button>
          <Button variant="outline" color="neutral" className="col-span-2">
            <ChevronDownIcon className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}/>
            <span className="hidden sm:inline">Logs</span>
          </Button>
        </Disclosure.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Disclosure.Panel className="pt-1">
            <LogTable userId={user.id}/>
          </Disclosure.Panel>
        </Transition>
      </div>
    )}
  </Disclosure>;
}