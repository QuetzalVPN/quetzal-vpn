import * as d3 from 'd3';
import dayjs from 'dayjs';
import {useEffect, useRef, useState} from 'react';

interface LineChartData {
  time: Date | number;
  value: number;
}

interface LineChartOptions {
  points?: boolean;
  alwaysZero?: boolean;
  curve?: d3.CurveFactory;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  fill?: boolean;
}

interface LineChartProps {
  data: LineChartData[];
  options: LineChartOptions;
}

export default ({data, options}: LineChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const handleResize = () => {
    if (svgRef.current) {
      setWidth(svgRef.current.clientWidth);
      setHeight(svgRef.current.clientHeight);
    }
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', () => {
      handleResize()
    });
    return () => window.removeEventListener('resize', () => {
    });
  }, []);

  useEffect(handleResize, [svgRef]);

  const margin = {
    top: 10,
    right: 10,
    bottom: 20,
    left: 20,
  };

  // Generate Ranges
  // Range of timestamps
  const xRange = d3.extent(data.map((d) => d.time));
  // Range of values
  let yRange = d3.extent(data.map((d) => d.value));

  // Check if xRange or yRange is undefined
  if (xRange[0] === undefined || xRange[1] === undefined) {
    throw Error('xRange is undefined');
  }

  if (yRange[0] === undefined || yRange[1] === undefined) {
    throw Error('yRange is undefined');
  }

  // If alwaysZero option is active, adjust yRange to show zero
  if (options.alwaysZero) {
    yRange = [Math.min(0, yRange[0] ?? 0), Math.max(0, yRange[1] ?? 0)];
  }

  // Generate scaling
  const xScale = d3
    .scaleTime()
    .domain(xRange)
    .range(
      width
        ? [margin.left, width - margin.right]
        : [0, 0]
    );
  const yScale = d3
    .scaleLinear()
    .domain(yRange)
    .range(
      height
        ? [height - margin.bottom, margin.top]
        : [0, 0]
    );

  // Generate line
  const line = d3
    .line<LineChartData>()
    .x((d) => xScale(d.time))
    .y((d) => yScale(d.value))
    .curve(options.curve || d3.curveLinear);

  const dLine = line(data);

  let area, dArea;

  if (options.fill) {
    area = d3.area<LineChartData>()
      .x(d => xScale(d.time))
      .y0(_ => yScale(0))
      .y1(d => yScale(d.value))
      .curve(options.curve || d3.curveLinear);

    dArea = area(data);
  }

  return (
    <svg
      ref={svgRef}
      className="w-full grow bg-none overflow-visible cursor-crosshair"
    >
      {/* Draw y-Scaling */}
      {yScale.ticks(4).map((max) => (
        <g key={max} transform={`translate(0, ${yScale(max)})`}>
          {/* Draw dashed line */}
          <line
            x1={margin.left}
            x2={width ? width - margin.right : 0}
            className={max === 0 ? 'stroke-current' : 'stroke-gray-neutral'}
            strokeDasharray={max === 0 ? 'none' : '5 5'}
          />
          {/* Draw text */}
          <text
            x={margin.left - 10}
            fontSize={11}
            className="fill-gray-neutral"
            textAnchor="end"
            alignmentBaseline="middle"
          >
            {max}
          </text>
        </g>
      ))}
      {/* Draw x-Scaling */}
      {xScale.ticks(4).map((time) => (
        <g transform={`translate(${xScale(time)}, 0)`} key={time.getTime()}>
          {/* Draw dashed line */}
          <line
            y1={
              height ? height - margin.bottom : 0
            }
            y2={margin.top}
            className="stroke-gray-neutral"
            strokeDasharray="5 5"
          />
          {/* Draw text */}
          <text
            y={
              height
                ? height - margin.bottom + 15
                : 0
            }
            fontSize={11}
            className="fill-gray-neutral"
            textAnchor="middle"
            alignmentBaseline="hanging"
          >
            {dayjs(time).format('HH:mm')}
          </text>
        </g>
      ))}

      {/* Draw line */}
      {dLine && (
        <path
          className="stroke-brand-green"
          d={dLine}
          fill="none"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Draw area */}
      {dArea && (
        <path
          d={dArea || ''}
          className="fill-brand-green opacity-10"
        />
      )}

      {/* Draw points */}
      {options.points &&
        data.map((d, i) => (
          <circle
            key={typeof d.time === 'number' ? d.time : d.time.getTime()}
            cx={xScale(d.time)}
            cy={yScale(d.value)}
            r={5}
            className="fill-brand-green stroke-2 stroke-light-foreground dark:stroke-dark-foreground"
          />
        ))}
    </svg>
  );
};
