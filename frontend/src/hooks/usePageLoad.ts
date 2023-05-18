import {useEffect} from "react";
import {useCurrentPage, useTitleState} from "./zustand";

export default (pageTitle: string, navbarIdx: number) => {
  const setCurrentPage = useCurrentPage((state) => state.move);
  const setBrowserTitle = useTitleState((state) => state.change);

  useEffect(() => {
    setBrowserTitle(pageTitle);
    setCurrentPage(navbarIdx);
  }, []);
}