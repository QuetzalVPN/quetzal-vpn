import PageTitle from "../components/PageTitle";
import ShadowBox from "../components/ShadowBox";
import { PageProps } from "./ConfigurationPage";
import usePageLoad from "../hooks/usePageLoad";
import { useLoginUsers } from "../hooks/useLoginUser";
import LoadingSpinner from "../components/LoadingSpinner";
import { Disclosure, Transition } from "@headlessui/react";
import Button from "../components/Button";
import { ChevronDownIcon, TrashIcon, UserIcon, UserMinusIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useDeleteVPNUser } from "../hooks/useVPNUser";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import Badge from "../components/Badge";
import Searchbar from "../components/Searchbar";
import { useState } from "react";
import * as fuzzysort from "fuzzysort";
import Dialog from "../components/Dialog";
import BasicInput, { PasswordInput } from "../components/BasicInput";
import LoginUserCreation from "../components/LoginUserCreation";

export default ({ navbarIdx }: PageProps) => {
  usePageLoad("Administration", navbarIdx);

  const loginUsers = useLoginUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleDelete = (id: number) => {
    console.log("delete", id);
  };

  return (
    <div className="w-full mt-4">
      <div className="flex flex-col gap-4 mb-12">
        <PageTitle title="Administration" />
        <ShadowBox className="w-full pb-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-lexend">Login Users</h2>
            <Searchbar value={searchTerm} onChange={(value) => setSearchTerm(value)} />
          </div>
          {loginUsers.isLoading && <><LoadingSpinner className="h-12" /><p>Loading...</p></>}
          {loginUsers.isError && <p className="text-brand-red">Error</p>}
          {loginUsers.isSuccess &&
            fuzzysort.go(searchTerm, loginUsers.data.data, { key: "username", all: true }).map(({ obj: user }) =>
              <Disclosure key={user.id}>
                {({ open }) => (
                  <div
                    className={`border-2 rounded-lg mb-2 border-gray-neutral/20`}>
                    <Disclosure.Button
                      as="div"
                      className={twMerge("grid grid-cols-8 lg:grid-cols-12 cursor-pointer w-full gap-4 items-center rounded-lg hover:bg-gray-neutral/10 p-1", open && "rounded-b-none bg-neutral-600/10 hover:bg-none")}>
                      <div
                        className="h-10 ml-4 sm:m-0 justify-self-center grid place-content-center aspect-square rounded-xl bg-gray-neutral/50">
                        <UserIcon className="h-6" />
                      </div>
                      <p className="ml-1 text-xl col-span-3 lg:col-span-7">{user.username}</p>
                      <Button className="col-span-2" variant="outline" color="red" onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(user.id);
                      }}>
                        <UserMinusIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                      <Button variant="outline" color="neutral" className="col-span-2">
                        <ChevronDownIcon className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
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
                      <Disclosure.Panel className="md:p-2 pt-1">
                        <table className="md:w-1/2 w-full">
                          <thead className="border-b border-gray-neutral/30 font-lexend">
                          <tr>
                            <th className="px-4 py-2 w-50">Timestamp</th>
                            <th className="px-4 py-2 w-50">Result</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr className="bg-gray-neutral/10">
                            <td
                              className="pl-4 sm:pl-4">{dayjs().subtract(1, "m").format("HH:mm:ss  -  DD.MM.YYYY")}</td>
                            <td className="text-center py-1">
                              <Badge>Success</Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="pl-4">{dayjs().format("HH:mm:ss  -  DD.MM.YYYY")}</td>
                            <td className="text-center py-1">
                              <Badge className="bg-brand-red text-dark-text">Failure</Badge>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </Disclosure.Panel>
                    </Transition>
                  </div>
                )}
              </Disclosure>
            )
          }
          <Dialog title="Create user" description="Enter information for the new user below" open={createDialogOpen}
                  onClose={() => {
                    setCreateDialogOpen(false);
                  }}>
            <LoginUserCreation onClose={() => setCreateDialogOpen(false)} />
          </Dialog>
          <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
            <UserPlusIcon className="h-5" />
            Create
          </Button>
        </ShadowBox>
      </div>
    </div>
  );
};
