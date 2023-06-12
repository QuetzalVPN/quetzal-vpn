import {Dayjs} from "dayjs";

interface LoginUser {
  id: number;
  username: string;
}

interface RawLoginUserLogEntry {
  id: number;
  dateTime: string;
  origin: string;
  successful: boolean;
  userId: number;
}

interface LoginUserLogEntry {
  id: number;
  dateTime: Dayjs;
  origin: string;
  successful: boolean;
  userId: number;
}

interface RawLoginUserLog {
  logs: RawLoginUserLogEntry[];
}

interface LoginUserLog {
  logs: LoginUserLogEntry[]
}

export type {LoginUser, RawLoginUserLog, RawLoginUserLogEntry, LoginUserLogEntry, LoginUserLog};