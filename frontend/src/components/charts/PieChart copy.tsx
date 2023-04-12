import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

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

export default ({ data, options }: PieChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [radius, setRadius] = useState(0);

  const updateRadius = () => {
    const diameter = Math.min(
      svgRef.current?.clientWidth ?? 0,
      svgRef.current?.clientHeight ?? 0
    );
    setRadius(diameter / 2);
  };

  useEffect(() => {
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  const pie = d3.pie().sort(() => 0);

  const formattedData = pie(data.map((d) => d.value));

  // Create arcGenerator
  const arcGenerator = d3
    .arc<d3.PieArcDatum<number | { valueOf(): number }>>()
    .innerRadius(options?.donutDivider ? radius / options.donutDivider : 0)
    .outerRadius(radius)
    .padAngle(0.04);

  // Create colorGenerator
  const colorGenerator = d3
    .scaleOrdinal<d3.PieArcDatum<number | { valueOf(): number }>, string>()
    .range(quetzalTheme);

  return (
    <svg ref={svgRef} className="w-full h-full bg-none overflow-visible">
      {formattedData.map((d, i) => (
        <g
          transform={`translate(${radius + (options.padding?.x ?? 0)}, ${
            radius + (options.padding?.y ?? 0)
          })`}
          key={data[i].label}
        >
          <path d={arcGenerator(d) ?? ''} fill={colorGenerator(d)} />
          <text
            fill={
              (hexToBrightness(colorGenerator(d)) ?? 0) > 0.5 ? '#000' : '#fff'
            }
            transform={`translate(${arcGenerator.centroid(d)})`}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {data[i].label}
          </text>
        </g>
      ))}
    </svg>
  );
};
