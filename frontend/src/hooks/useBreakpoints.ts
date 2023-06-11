import {useEffect, useState} from "react";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

type Breakpoint = keyof typeof breakpoints;

const useBiggerThan = (breakpoint: Breakpoint) => {
  const [biggerThan, setBiggerThan] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`);
    setBiggerThan(mediaQuery.matches);

    const listener = () => setBiggerThan(mediaQuery.matches);
    mediaQuery.addEventListener("change", listener);

    return () => mediaQuery.removeEventListener("change", listener);
  }, [breakpoint]);

  return biggerThan;
};

const useSmallerThan = (breakpoint: Breakpoint) => {
  const [smallerThan, setSmallerThan] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoints[breakpoint]}px)`);
    setSmallerThan(mediaQuery.matches);

    const listener = () => setSmallerThan(mediaQuery.matches);
    mediaQuery.addEventListener("change", listener);

    return () => mediaQuery.removeEventListener("change", listener);
  }, [breakpoint]);

  return smallerThan;
};

const useBetween = (breakpointMin: Breakpoint, breakpointMax: Breakpoint) => {
  const [between, setBetween] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(min-width: ${breakpoints[breakpointMin]}px) and (max-width: ${breakpoints[breakpointMax]}px)`
    );
    setBetween(mediaQuery.matches);

    const listener = () => setBetween(mediaQuery.matches);
    mediaQuery.addEventListener("change", listener);

    return () => mediaQuery.removeEventListener("change", listener);
  }, [breakpointMin, breakpointMax]);

  return between;
};

export {useBiggerThan, useSmallerThan, useBetween};