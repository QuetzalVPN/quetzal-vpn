import PageTitle from '../components/PageTitle';
import ShadowBox from '../components/ShadowBox';
import usePageLoad from "../hooks/usePageLoad";
import 'react-toastify/dist/ReactToastify.css';
import {Disclosure, Transition} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/24/outline";
import NavButton from "../components/NavButton";
import {useEffect, useState} from "react";
import {ConfigInput} from "../components/BasicInput";
import Button from "../components/Button";
import InfoTooltip from "../components/InfoTooltip";
import Checkbox from "../components/Checkbox";
import ConfigItem from "../components/ConfigItem";
import Select from "../components/Select";
import {useQueryClient} from "react-query";
import AutocompleteSelect, {SelectOption} from "../components/AutocompleteSelect";
import {useVPNServerConfiguration, useUpdateVPNServerConfiguration} from "../hooks/useVPNConfiguration";
import {VPNServerConfig} from "../types/VPNServerConfig";
import {useVPNServerRestart} from "../hooks/useVPNManagement";

export interface PageProps {
  navbarIdx: number;
}

const IP_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const PROTOCOL_OPTIONS: SelectOption[] = ['TCP', 'UDP'].map((protocol, idx) => ({
  id: idx,
  name: protocol,
  value: protocol
}));

const CIPHER_OPTIONS: SelectOption[] = [
  "AES-256-GCM",
  "AES-128-GCM",
  "AES-256-CBC",
  "AES-192-CBC",
  "AES-128-CBC",
  "CHACHA20-POLY1305"
].map((cipher, idx) => ({
  id: idx,
  name: cipher,
  value: cipher
}));

const LOG_METHOD_OPTIONS: SelectOption[] = [
  "append",
  "truncate"
].map((method, idx) => ({
  id: idx,
  name: method,
  value: method
}));

// TODO: Refactor into smaller components
export default ({navbarIdx}: PageProps) => {
  usePageLoad("Configuration", navbarIdx);

  const queryClient = useQueryClient();

  const vpnServerConfig = useVPNServerConfiguration();
  const updateVPNServerConfig = useUpdateVPNServerConfiguration();

  const [protocol, setProtocol] = useState<SelectOption>(PROTOCOL_OPTIONS[0]);
  const [port, setPort] = useState('1194');

  const [serverSubnet, setServerSubnet] = useState('');
  const [serverMask, setServerMask] = useState('');

  const [poolPersistOn, setPoolPersistOn] = useState(false);
  const [poolPersistFile, setPoolPersistFile] = useState('');

  const [clientToClient, setClientToClient] = useState(false);
  const [duplicateCN, setDuplicateCN] = useState(false);
  const [explicitExitNotify, setExplicitExitNotify] = useState(true);

  const [keepAliveOn, setKeepAliveOn] = useState(false);
  const [keepAliveInterval, setKeepAliveInterval] = useState('');
  const [keepAliveTimeout, setKeepAliveTimeout] = useState('');

  const [cipher, setCipher] = useState<SelectOption>(CIPHER_OPTIONS[0]);

  const [maxClientsOn, setMaxClientsOn] = useState(false);
  const [maxClients, setMaxClients] = useState('');

  const [statusFileOn, setStatusFileOn] = useState(false);
  const [statusFile, setStatusFile] = useState('');

  const [logFileOn, setLogFileOn] = useState(false);
  const [logFileMethod, setLogFileMethod] = useState<SelectOption>(LOG_METHOD_OPTIONS[0]);
  const [logFile, setLogFile] = useState('');

  const [verbosity, setVerbosity] = useState('4');


  useEffect(() => {
    if (vpnServerConfig.isSuccess) {
      setProtocol(PROTOCOL_OPTIONS.find(option => option.value === vpnServerConfig.data.proto) || PROTOCOL_OPTIONS[0]);
      setPort(vpnServerConfig.data.port.toString());

      setServerSubnet(vpnServerConfig.data.server.subnet);
      setServerMask(vpnServerConfig.data.server.mask);

      if (vpnServerConfig.data.poolPersist === null) {
        setPoolPersistOn(false);
        setPoolPersistFile('');
      } else {
        setPoolPersistOn(true);
        setPoolPersistFile(vpnServerConfig.data.poolPersist);
      }

      setClientToClient(vpnServerConfig.data.clientToClient);
      setDuplicateCN(vpnServerConfig.data.duplicateCN);
      setExplicitExitNotify(vpnServerConfig.data.explicitExitNotify);

      if (vpnServerConfig.data.keepAlive === null) {
        setKeepAliveOn(false);
        setKeepAliveInterval('');
        setKeepAliveTimeout('');
      } else {
        setKeepAliveOn(true);
        setKeepAliveInterval(vpnServerConfig.data.keepAlive.interval.toString());
        setKeepAliveTimeout(vpnServerConfig.data.keepAlive.timeout.toString());
      }

      setCipher(CIPHER_OPTIONS.find(option => option.value === vpnServerConfig.data.cipher) || CIPHER_OPTIONS[0]);

      if (vpnServerConfig.data.maxClients === null) {
        setMaxClientsOn(false);
        setMaxClients('');
      } else {
        setMaxClientsOn(true);
        setMaxClients(vpnServerConfig.data.maxClients.toString());
      }

      if (vpnServerConfig.data.status === null) {
        setStatusFileOn(false);
        setStatusFile('');
      } else {
        setStatusFileOn(true);
        setStatusFile(vpnServerConfig.data.status);
      }

      if (vpnServerConfig.data.log === null) {
        setLogFileOn(false);
        setLogFileMethod(LOG_METHOD_OPTIONS[0]);
        setLogFile('');
      } else {
        setLogFileOn(true);
      }

      setVerbosity(vpnServerConfig.data.verbosity.toString());
    }
  }, [vpnServerConfig.isFetching]);

  const handleSubmit = () => {
    if (vpnServerConfig.isSuccess) {
      const newConfig: VPNServerConfig = {
        ...vpnServerConfig.data,
        proto: protocol.value,
        port: parseInt(port),
        server: {
          subnet: serverSubnet,
          mask: serverMask
        },
        poolPersist: poolPersistOn ? poolPersistFile : null,
        clientToClient,
        duplicateCN,
        explicitExitNotify,
        keepAlive: keepAliveOn ? {
          interval: parseInt(keepAliveInterval),
          timeout: parseInt(keepAliveTimeout)
        } : null,
        cipher: cipher.value,
        maxClients: maxClientsOn ? parseInt(maxClients) : null,
        status: statusFileOn ? statusFile : null,
        // log: logFileOn ? {
        //   method: logFileMethod.value,
        //   file: logFile
        // } : null,
        // log: null,
        verbosity: parseInt(verbosity),
      };

      updateVPNServerConfig.mutate(newConfig);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4 w-full">
      <PageTitle title="VPN Configuration"/>
      <ShadowBox>
        <Disclosure defaultOpen={true}>
          {({open}) => (
            <>
              <Disclosure.Button as="div" className="flex w-full items-center justify-between cursor-pointer">
                <h3 className="text-2xl">Server Config</h3>
                <NavButton>
                  <ChevronDownIcon className={`h-6 transition-transform ${open ? 'rotate-180' : ''}`}/>
                </NavButton>
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="mt-1">
                  <form
                    onReset={(e) => {
                      e.preventDefault();
                      queryClient.invalidateQueries('vpnServerConfiguration');
                    }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}>
                    <h4 className="font-lexend text-xl">Transport Layer</h4>
                    <div className="flex gap-4 mt-1">
                      <ConfigItem
                        label="Protocol"
                        info="The transport layer protocol that the server will use."
                      >
                        <Select value={protocol} onChange={setProtocol} options={PROTOCOL_OPTIONS}/>
                      </ConfigItem>
                      <ConfigItem
                        label="Port"
                        info="The port that the server will listen on."
                        className="w-32"
                        id="port"
                      >
                        <ConfigInput id='port'
                                     required
                                     placeholder="1194"
                                     value={port}
                                     onChange={(e) => setPort(e.target.value)}
                                     type="number"
                                     className="w-32"
                                     min={1} max={65535}
                        />
                      </ConfigItem>
                    </div>

                    <h4 className="text-xl font-lexend mt-2">Server</h4>
                    <div className="flex gap-4 flex-wrap">
                      <ConfigItem
                        label="Subnet"
                        info="The subnet that the server will use to assign IP addresses to clients."
                        id="server-subnet"
                        className="grow sm:max-w-xs"
                      >
                        <ConfigInput placeholder="192.168.0.0"
                                     id={'server-subnet'}
                                     value={serverSubnet}
                                     onChange={(e) => setServerSubnet(e.target.value)}
                                     pattern={IP_REGEX.source}
                                     className="w-full"
                        />
                      </ConfigItem>
                      <ConfigItem
                        label="Netmask"
                        info="The subnet-mask that the server will use to assign IP addresses to clients."
                        id="server-mask"
                        className="grow sm:max-w-xs">
                        <ConfigInput placeholder="255.255.255.0" id={'server-mask'}
                                     value={serverMask}
                                     onChange={(e) => setServerMask(e.target.value)}
                                     pattern={IP_REGEX.source}
                                     className="w-full"/>
                      </ConfigItem>
                    </div>

                    <h4 className="text-xl font-lexend mt-2">Other options</h4>
                    <div className="flex gap-4 mt-1 flex-wrap">
                      <ConfigItem
                        label="Pool persist"
                        info="Whether to persist the IP address pool in a file."
                        id={poolPersistOn ? 'pool-persist' : 'pool-persist-check'}
                      >
                        <div className="flex gap-2 items-center">
                          <Checkbox id='pool-persist-check' checked={poolPersistOn}
                                    onChange={() => setPoolPersistOn(prev => !prev)}/>
                          <ConfigInput placeholder="ipp.txt" id={'pool-persist'} disabled={!poolPersistOn}
                                       value={poolPersistFile} onChange={(e) => setPoolPersistFile(e.target.value)}/>
                        </div>
                      </ConfigItem>

                      <ConfigItem
                        label="Client 2 client"
                        info="Whether clients can communicate with each other."
                        id="client-to-client"
                      >
                        <div className="flex justify-center py-2">
                          <Checkbox id={'client-to-client'} checked={clientToClient}
                                    onChange={() => setClientToClient(prev => !prev)}/>
                        </div>
                      </ConfigItem>

                      <ConfigItem
                        label="Duplicate CN"
                        info="Whether clients can have the same cert/key."
                        warning="Not recommended!"
                        id="duplicate-cn"
                      >
                        <div className="flex justify-center py-2">
                          <Checkbox id='duplicate-cn' checked={duplicateCN}
                                    onChange={() => setDuplicateCN(prev => !prev)}/>
                        </div>
                      </ConfigItem>

                      <ConfigItem
                        label="Explicit Exit Notify"
                        info="Whether the server will send an exit notification to the client. Client will automatically reconnect when server restarts."
                        id="explicit-exit-notify"
                      >
                        <div className="flex justify-center py-2">
                          <Checkbox id="explicit-exit-notify" checked={explicitExitNotify}
                                    onChange={() => setExplicitExitNotify(prev => !prev)}/>
                        </div>
                      </ConfigItem>
                      <div>
                        <div className="flex justify-between items-center gap-2">
                          <label className="text-lg font-lexend" htmlFor="keep-alive">Keep alive [s]:</label>
                          <InfoTooltip className="text-center -left-32 w-72"
                                       info="The interval and timeout at which the server will send keep alive packets to clients."/>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Checkbox checked={keepAliveOn} onChange={() => setKeepAliveOn(prev => !prev)}/>
                          <ConfigInput
                            type={'number'}
                            min={1}
                            max={1000}
                            value={keepAliveInterval}
                            onChange={e => setKeepAliveInterval(e.target.value)}
                            disabled={!keepAliveOn}
                            placeholder="Interval"
                            className="w-24"/>
                          <ConfigInput
                            min={1}
                            max={1000}
                            type={'number'}
                            value={keepAliveTimeout}
                            onChange={e => setKeepAliveTimeout(e.target.value)}
                            disabled={!keepAliveOn}
                            placeholder="Timeout"
                            className="w-24"/>
                        </div>
                      </div>

                      <ConfigItem
                        label="Cipher"
                        info="The cipher that will be used to encrypt the connection between the client and the server."
                        id="cipher"
                      >
                        <AutocompleteSelect
                          value={cipher}
                          onChange={setCipher}
                          options={CIPHER_OPTIONS}
                        />
                        {/*<Combobox value={cipher} onChange={setCipher}>*/}
                        {/*  <div className="relative">*/}
                        {/*    <div*/}
                        {/*      className="relative flex outline-none items-center justify-between rounded-md bg-light-midground dark:bg-dark-midground py-2 pl-3 pr-1">*/}
                        {/*      <Combobox.Input*/}
                        {/*        className="bg-transparent border-none outline-none focus:outline-none p-0"*/}
                        {/*        onChange={e => setCipherQuery(e.target.value)}*/}
                        {/*      />*/}
                        {/*      <Combobox.Button>*/}
                        {/*        <ChevronUpDownIcon className="h-5" aria-hidden={true}/>*/}
                        {/*      </Combobox.Button>*/}
                        {/*    </div>*/}
                        {/*    <Transition*/}
                        {/*      as={Fragment}*/}
                        {/*      leave="transition ease-in duration-100"*/}
                        {/*      leaveFrom="opacity-100"*/}
                        {/*      leaveTo="opacity-0"*/}
                        {/*      afterLeave={() => setCipherQuery('')}*/}
                        {/*    >*/}
                        {/*      <Combobox.Options*/}
                        {/*        as={ShadowBox}*/}
                        {/*        className="absolute w-full p-0 bg-light-foreground dark:bg-dark-midground border border-gray-neutral/30 mt-2 max-h-60 overflow-auto rounded-md"*/}
                        {/*      >*/}
                        {/*        {filteredCiphers.map((option, index) => (*/}
                        {/*          <Combobox.Option*/}
                        {/*            key={index}*/}
                        {/*            value={option}*/}
                        {/*            className={({active}) => `${active ? 'bg-brand-green/10' : ''} relative cursor-default items-center select-none py-1.5 pl-8 pr-4 px-4 list-none`*/}
                        {/*            }*/}
                        {/*          >*/}
                        {/*            {({selected}) => <>*/}
                        {/*              {selected &&*/}
                        {/*                  <span className="absolute inset-y-0 flex items-center pl-2 left-0"><CheckIcon*/}
                        {/*                      className="h-5 text-brand-green"/></span>}*/}
                        {/*              <span>{option}</span>*/}
                        {/*            </>}*/}
                        {/*          </Combobox.Option>*/}
                        {/*        ))}*/}
                        {/*      </Combobox.Options>*/}
                        {/*    </Transition>*/}
                        {/*  </div>*/}
                        {/*</Combobox>*/}
                      </ConfigItem>

                      <ConfigItem
                        label="Max clients"
                        info="The maximum number of clients that can connect to the server at the same time."
                        id={maxClientsOn ? 'max-clients' : 'max-clients-check'}
                        className="w-48"
                      >
                        <div className="flex gap-2 items-center">
                          <Checkbox id='max-clients-check' checked={maxClientsOn}
                                    onChange={() => setMaxClientsOn(prev => !prev)}/>
                          <ConfigInput type={'number'} min={1} max={1000} value={maxClients} id={'max-clients'}
                                       onChange={e => setMaxClients(e.target.value)} disabled={!maxClientsOn}
                                       placeholder="Max clients"
                                       className="w-24"/>
                        </div>
                      </ConfigItem>


                    </div>
                    <h4 className="font-lexend text-xl mt-2">Logging</h4>
                    <div className="flex gap-4 flex-wrap">
                      <ConfigItem
                        label="Status file"
                        info="The file that will be used to log the status of the server. It is rewritten every 60 seconds."
                        id={statusFileOn ? 'status-file' : 'status-file-check'}
                      >
                        <div className="flex gap-2 items-center">
                          <Checkbox id='status-file-check' checked={statusFileOn}
                                    onChange={() => setStatusFileOn(prev => !prev)}/>
                          <ConfigInput
                            disabled={!statusFileOn}
                            value={statusFile}
                            id={'status-file'}
                            onChange={e => setStatusFile(e.target.value)}
                            placeholder="Status file"
                            className="w-48"/>
                        </div>
                      </ConfigItem>

                      <ConfigItem
                        label={"Log file"}
                        info={"The file that will be used to log the server's output."}
                        id={logFileOn ? 'log-file' : 'log-file-check'}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox id='log-file-check' checked={logFileOn}
                                    onChange={() => setLogFileOn(prev => !prev)}/>
                          <Select
                            className="w-28"
                            disabled={!logFileOn}
                            value={logFileMethod}
                            onChange={setLogFileMethod}
                            options={LOG_METHOD_OPTIONS}
                          />
                          <ConfigInput
                            disabled={!logFileOn}
                            value={logFile}
                            id={'log-file'}
                            onChange={e => setLogFile(e.target.value)}
                            placeholder="Log file"
                          />
                        </div>
                      </ConfigItem>

                      <ConfigItem
                        label={"Verbosity"}
                        info={"The verbosity level of the server's output. 4 is recommended."}
                        id={'verbosity'}
                      >
                        <ConfigInput
                          type={'number'}
                          min={0}
                          max={9}
                          value={verbosity}
                          id={'verbosity'}
                          onChange={e => setVerbosity(e.target.value)}
                          placeholder="0-9"
                          className="w-24"/>
                      </ConfigItem>
                    </div>

                    {/*TODO: Add support for DHCP options*/}
                    {/*<h4 className="font-lexend text-xl mt-2">DHCP</h4>*/}
                    {/*<h5 className="font-lexend text-lg">Routes</h5>*/}
                    {/*<h5 className="font-lexend text-lg">Options</h5>*/}

                    <div className="flex mt-2 justify-end items-center gap-4">
                      <InfoTooltip info="Changing the configuration will restart the server." className="text-center w-64 -left-28" />
                      <Button type="reset" variant="outline" color="red">Discard</Button>
                      <Button type="submit">Apply</Button>
                    </div>
                  </form>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </ShadowBox>
    </div>
  );
}
;
