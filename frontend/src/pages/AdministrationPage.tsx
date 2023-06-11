import PageTitle from "../components/PageTitle";
import ShadowBox from "../components/ShadowBox";
import {PageProps} from "./ConfigurationPage";
import usePageLoad from "../hooks/usePageLoad";
import {useLoginUsers} from "../hooks/useLoginUser";
import LoadingSpinner from "../components/LoadingSpinner";
import {Disclosure, Transition} from "@headlessui/react";
import Button from "../components/Button";
import {ChevronDownIcon, TrashIcon, UserIcon, UserMinusIcon, UserPlusIcon} from "@heroicons/react/24/outline";
import {useDeleteVPNUser} from "../hooks/useVPNUser";
import dayjs from "dayjs";
import {twMerge} from "tailwind-merge";
import Badge from "../components/Badge";
import Searchbar from "../components/Searchbar";
import {useState} from "react";
import * as fuzzysort from "fuzzysort";
import Dialog from "../components/Dialog";
import BasicInput, {PasswordInput} from "../components/BasicInput";
import LoginUserCreation from "../components/LoginUserCreation";
import LoginUserListItem from "../components/LoginUserListItem";
import {LoginUserLogEntry} from "../types/LoginUsers";

export default ({navbarIdx}: PageProps) => {
  usePageLoad("Administration", navbarIdx);

  const loginUsers = useLoginUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="w-full mt-4">
      <div className="flex flex-col gap-4 mb-12">
        <PageTitle title="Administration"/>
        <ShadowBox className="w-full pb-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-lexend">Login Users</h2>
            <Searchbar value={searchTerm} onChange={(value) => setSearchTerm(value)}/>
          </div>
          {loginUsers.isLoading && <><LoadingSpinner className="h-12"/><p>Loading...</p></>}
          {loginUsers.isError && <p className="text-brand-red">Error</p>}
          {loginUsers.isSuccess &&
            fuzzysort.go(searchTerm.trim(), loginUsers.data.data, {key: "username", all: true}).map(({obj: user}) =>
              <LoginUserListItem key={user.id} user={user}/>)
          }
          <Dialog title="Create user" description="Enter information for the new user below" open={createDialogOpen}
                  onClose={() => {
                    setCreateDialogOpen(false);
                  }}>
            <LoginUserCreation onClose={() => setCreateDialogOpen(false)}/>
          </Dialog>
          <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
            <UserPlusIcon className="h-5"/>
            Create
          </Button>
        </ShadowBox>
      </div>
    </div>
  );
};
