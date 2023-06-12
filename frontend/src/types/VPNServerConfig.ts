type TransportProtocol = "TCP" | "UDP";

// Ciphers: https://openvpn.net/vpn-server-resources/change-encryption-cipher-in-access-server/
type Cipher =
  "AES-256-GCM" |
  "AES-128-GCM" |
  "CHACHA20-POLY1305" |
  "AES-256-CBC" |
  "AES-192-CBC" |
  "AES-128-CBC"
  ;

interface ServerSettings {
  subnet: string;
  mask: string;
}

interface KeepAliveOptions {
  interval: number;
  timeout: number;
}

interface Route {
  network: string;
  subnetMask: string;
}

interface DHCPOption {
  type: string; //TODO: Find out what this is, make it union type
  param: string;
}

interface PushOptions {
  routes: Route[];
  dhcpOptions: DHCPOption[];
  redirectAll: boolean;
}

interface VPNServerConfig {
  port: number;
  proto: TransportProtocol;
  server: ServerSettings;
  poolPersist: null | string;
  clientToClient: boolean;
  duplicateCN: boolean;
  explicitExitNotify: boolean;
  keepAlive: null | KeepAliveOptions;
  cipher: null | Cipher;
  maxClients: null | number;
  status: null | string;
  log: null | string;
  verbosity: number;
  pushOptions: PushOptions
}

export type {
  VPNServerConfig,
  TransportProtocol,
  ServerSettings,
  KeepAliveOptions,
  Route,
  DHCPOption,
  PushOptions,
  Cipher
};