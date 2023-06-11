import * as d3 from 'd3';
import {useEffect, useRef, useState} from 'react';

const TRANSITION_DURATION = 200;

interface PieChartData {
  label: string;
  value: number;
}

interface PieChartOptions {
  donutDivider?: number;
  padding?: {
    x: number;
    y: number;
  };
}

interface PieChartProps {
  data: PieChartData[];
  options: PieChartOptions;
}

function hexToBrightness(hex: string): number {
  // Remove the hash symbol if present
  hex = hex.replace('#', '');
  // Convert the hex string to an RGB array
  const rgb = [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
  // Calculate the brightness using the formula (R * 299 + G * 587 + B * 114) / 1000
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  // Normalize the brightness to a value between 0 and 1
  return brightness / 255;
}

const quetzalTheme = [
  '#ff3735',
  '#00ff70',
  '#ff9f00',
  '#00bfff',
  '#fb025f',
  '#f1cabf',
];

export default ({data, options}: PieChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [radius, setRadius] = useState(0);
  const [displayData, setDisplayData] = useState(data);
  const [textTransform, setTextTransform] = useState('translate(0, 0)');

  const handleResize = () => {
    const diameter = Math.min(
      svgRef.current?.clientWidth ?? 0,
      svgRef.current?.clientHeight ?? 0
    );
    setRadius(diameter / 2);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pie = d3.pie().sort(() => 0);

  // Create arcGenerator
  const arcGenerator = d3
    .arc<d3.PieArcDatum<number | { valueOf(): number }>>()
    .innerRadius(options?.donutDivider ? radius / options.donutDivider : 0)
    .outerRadius(radius)
    .padAngle(0.04);

  // Create colorGenerator
  const colorGenerator = d3
    .scaleOrdinal<PieChartData, string>()
    .range(quetzalTheme);

  useEffect(() => {
    if (svgRef.current) {
      const newData = pie(data.map((d) => d.value));
      const oldData = pie(displayData.map((d) => d.value));

      d3.select(svgRef.current)
        .selectAll('path')
        .transition()
        .duration(TRANSITION_DURATION)
        .attr('fill', (d, i) => quetzalTheme[i])
        .attrTween('d', (d, i) => {
          const copy = {...oldData[i]};

          const interpolateStartAngle = d3.interpolate(
            oldData[i].startAngle,
            newData[i].startAngle
          );
          const interpolateEndAngle = d3.interpolate(
            oldData[i].endAngle,
            newData[i].endAngle
          );

          return (t) => {
            copy.startAngle = interpolateStartAngle(t);
            copy.endAngle = interpolateEndAngle(t);

            return arcGenerator(copy) ?? '';
          };
        })
        .on('end', () => {
          setDisplayData(data);
        });
    }
  }, [data, svgRef.current, radius]);

  return (
    <svg ref={svgRef} className="w-fit grow bg-none overflow-visible">
      {pie(displayData.map((d) => d.value)).map((d, i) => (
        <g
          transform={`translate(${radius + (options.padding?.x ?? 0)}, ${
            radius + (options.padding?.y ?? 0)
          })`}
          key={data[i].label}
        >
          <path/>
        </g>
      ))}
      <g
        transform={`translate(${radius + (options.padding?.x ?? 0)}, ${
          radius + (options.padding?.y ?? 0)
        })`}
      ></g>
    </svg>
  );
};
