import { useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle';
import { useCurrentPage } from '../hooks/zustand';
import { PageProps } from './ConfigurationPage';
import ShadowBox from '../components/ShadowBox';
import LineChart from '../components/charts/LineChart';
import { curveMonotoneX } from 'd3';
import PieChart from '../components/charts/AnimatedPieChart';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';

// TODO: Assign fitting color to traffic arrows
const colors = [
  { max: 10, color: '#00FF70' },
  { max: 20, color: '#F9C81B' },
  { max: 30, color: '#F91B1B' },
];

export default ({ navbarIdx }: PageProps) => {
  const setNavposition = useCurrentPage((state) => state.move);

  const [activeUsers, setActiveUsers] = useState([
    { time: Date.now() - 1000, value: 6 },
  ]);

  const [trafficData, setTrafficData] = useState([
    { label: 'Upload', value: 14 },
    { label: 'Download', value: 22 },
  ]);

  const randomizeTraffic = () => {
    setTrafficData([
      { label: 'Upload', value: Math.floor(Math.random() * 35) + 1 },
      { label: 'Download', value: Math.floor(Math.random() * 35 + 1) },
    ]);
  };

  useEffect(() => setNavposition(navbarIdx), []);

  return (
    <div className="mt-8 w-full flex flex-col gap-4">
      <PageTitle title="Dashboard" />
      <div className="flex flex-wrap justify-center gap-4 flex-">
        <ShadowBox className="flex flex-col h-fit">
          <div className="flex items-center gap-2">
            <h2 className="text-xl">Current Traffic</h2>
            <Button onClick={randomizeTraffic}>Randomize</Button>
          </div>

          <div className="flex gap-2 items-center w-fit">
            <p>{trafficData[1].value} Mbit/s</p>
            <ArrowDownIcon
              className="h-6"
              color={
                colors.reduce((prev, cur) =>
                  trafficData[1].value <= cur.max ? prev : cur
                ).color
              }
            />
          </div>
          <div className="flex gap-2 items-center w-fit">
            <p>{trafficData[0].value} Mbit/s</p>
            <ArrowUpIcon
              className="h-6"
              color={
                colors.reduce((prev, cur) =>
                  trafficData[0].value <= cur.max ? prev : cur
                ).color
              }
            />
          </div>
        </ShadowBox>
        {/* Active User Panel */}
        <ShadowBox className="h-96 grow">
          <div className="flex gap-4 items-center">
            <h2 className="text-xl">Active Users </h2>
            <Button
              onClick={() => {
                setActiveUsers([
                  ...activeUsers,
                  { time: Date.now(), value: Math.floor(Math.random() * 10) },
                ]);
              }}
            >
              Add
            </Button>
          </div>
          <LineChart
            data={activeUsers.slice(-10)}
            options={{ alwaysZero: true, points: true, curve: curveMonotoneX }}
          />
        </ShadowBox>
        {/* Down vs. Up Panel */}
        <ShadowBox className="h-96">
          <div className="flex items-center gap-4">
            <h2 className="text-xl">Download / Upload</h2>
            <Button onClick={randomizeTraffic}>Update</Button>
          </div>
          <PieChart data={trafficData} options={{ donutDivider: 2 }} />
        </ShadowBox>
      </div>
    </div>
  );
};
