import type { Dayjs } from "dayjs";

interface VPNClient {
  commonName: string;
  realAddress: string;
  bytesReceived: number;
  bytesSent: number;
  connectedSince: Dayjs;
}

interface RawVPNClient {
  commonName: string;
  realAddress: string;
  bytesReceived: number;
  bytesSent: number;
  connectedSince: string;
}

interface VPNRoute {
  virtualAddress: string;
  commonName: string;
  realAddress: string;
  lastRef: Dayjs;
}

interface RawVPNRoute {
  virtualAddress: string;
  commonName: string;
  realAddress: string;
  lastRef: string;
}

interface VPNStatus {
  updated: Dayjs;
  clients: VPNClient[];
  routes: VPNRoute[];
  rawStatus: string;
}

interface RawVPNStatus {
  updated: string;
  clients: RawVPNClient[];
  routes: RawVPNRoute[];
  rawStatus: string;
}

export type { VPNStatus, VPNClient, VPNRoute };
export type { RawVPNStatus, RawVPNClient, RawVPNRoute };