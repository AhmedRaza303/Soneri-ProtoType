/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { ChartDataPoint } from '../../data/dashboardAnalyticsData';
import { useTheme } from '../../context/ThemeContext';

interface ContainerDualAxisChartProps {
  id?: string;
  title: string;
  subEyebrow?: string;
  data: ChartDataPoint[];
  maxLeft: number;
  maxRight: number;
  leftStep?: number;
  rightStep?: number;
  onViewAll?: () => void;
}

export const ContainerDualAxisChart: React.FC<ContainerDualAxisChartProps> = ({
  id,
  title,
  subEyebrow = 'CONTAINER ANALYTICS',
  data,
  maxLeft,
  maxRight,
  leftStep,
  rightStep,
  onViewAll,
}) => {
  const { isDark } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate ticks
  const leftTicksCount = 5;
  const stepL = leftStep || maxLeft / leftTicksCount;
  const leftTicks: number[] = [];
  for (let i = 0; i <= leftTicksCount; i++) {
    leftTicks.push(Math.round(i * stepL));
  }

  const rightTicksCount = 5;
  const stepR = rightStep || maxRight / rightTicksCount;
  const rightTicks: number[] = [];
  for (let i = 0; i <= rightTicksCount; i++) {
    rightTicks.push(Math.round(i * stepR));
  }

  // Chart layout parameters inside SVG
  const svgWidth = 560;
  const svgHeight = 270;
  const paddingLeft = 46;
  const paddingRight = 72;
  const paddingTop = 25;
  const paddingBottom = 65;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const numItems = data.length;
  const groupWidth = chartWidth / numItems;
  const barWidth = Math.max(6, Math.min(14, groupWidth * 0.28));

  // Compute points for Profit line
  const profitPoints = data.map((d, index) => {
    const x = paddingLeft + index * groupWidth + groupWidth / 2;
    const ratio = Math.max(0, Math.min(1, d.profit / maxRight));
    const y = paddingTop + chartHeight - ratio * chartHeight;
    return { x, y, ...d };
  });

  const pathD = profitPoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Format currency for axis and tooltip
  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `$ ${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `$ ${val.toLocaleString()}`;
    }
    return `$ ${val}`;
  };

  const formatTooltipCurrency = (val: number) => {
    return `$ ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  };

  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;
  const hoveredPoint = hoveredIndex !== null ? profitPoints[hoveredIndex] : null;

  return (
    <div
      id={id}
      ref={containerRef}
      className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all relative select-none ${
        isDark
          ? 'bg-[#111726] border-slate-800/80 shadow-xs hover:border-slate-700'
          : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <span
            className={`text-[9px] sm:text-[10px] font-bold tracking-wider uppercase block ${
              isDark ? 'text-indigo-400' : 'text-slate-400'
            }`}
          >
            {subEyebrow}
          </span>
          <h3
            className={`text-sm sm:text-base font-bold tracking-tight ${
              isDark ? 'text-slate-100' : 'text-[#1e293b]'
            }`}
          >
            {title}
          </h3>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className={`text-xs font-bold flex items-center gap-1 shrink-0 mt-0.5 cursor-pointer transition-colors ${
            isDark
              ? 'text-indigo-400 hover:text-indigo-300'
              : 'text-[#1e293b] hover:text-blue-600'
          }`}
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Legend */}
      <div
        className={`flex items-center justify-center gap-4 text-[11px] font-semibold my-2 ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#3b82f6]" />
          <span>Delivered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#10b981]" />
          <span>Confirmed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#f97316]" />
          <span>Profit</span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-x-auto -mx-1 sm:mx-0 px-1 sm:px-0 pb-1">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[320px] sm:min-w-0 select-none"
          style={{ minHeight: '185px' }}
        >
          {/* Horizontal Gridlines & Left Ticks */}
          {leftTicks.map((tick, i) => {
            const ratio = tick / maxLeft;
            const y = paddingTop + chartHeight - ratio * chartHeight;
            const rTick = rightTicks[i] ?? 0;

            return (
              <g key={`grid-${i}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke={isDark ? '#1e293b' : '#f1f5f9'}
                  strokeWidth="1"
                />
                {/* Left Y Axis Label */}
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className={`text-[10px] font-medium ${isDark ? 'fill-slate-500' : 'fill-slate-400'}`}
                >
                  {tick}
                </text>
                {/* Right Y Axis Label */}
                <text
                  x={svgWidth - paddingRight + 8}
                  y={y + 3.5}
                  textAnchor="start"
                  className={`text-[10px] font-medium ${isDark ? 'fill-slate-500' : 'fill-slate-400'}`}
                >
                  {formatCurrency(rTick)}
                </text>
              </g>
            );
          })}

          {/* Grouped Bars */}
          {data.map((item, index) => {
            const groupX = paddingLeft + index * groupWidth;
            const centerX = groupX + groupWidth / 2;

            // Bar 1: Delivered (Blue)
            const delRatio = Math.max(0, Math.min(1, item.delivered / maxLeft));
            const delHeight = delRatio * chartHeight;
            const delY = paddingTop + chartHeight - delHeight;
            const delX = centerX - barWidth - 1;

            // Bar 2: Confirmed (Teal/Green)
            const confRatio = Math.max(0, Math.min(1, item.confirmed / maxLeft));
            const confHeight = confRatio * chartHeight;
            const confY = paddingTop + chartHeight - confHeight;
            const confX = centerX + 1;

            const isHovered = hoveredIndex === index;

            return (
              <g
                key={`bars-${index}`}
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => setHoveredIndex(isHovered ? null : index)}
              >
                {/* Invisible hover area for touch/mouse */}
                <rect
                  x={groupX}
                  y={paddingTop}
                  width={groupWidth}
                  height={chartHeight}
                  fill="transparent"
                />

                {/* Delivered Bar */}
                <rect
                  x={delX}
                  y={delY}
                  width={barWidth}
                  height={Math.max(1, delHeight)}
                  rx="1.5"
                  fill="#3b82f6"
                  opacity={hoveredIndex === null || isHovered ? 1 : 0.45}
                />

                {/* Confirmed Bar */}
                <rect
                  x={confX}
                  y={confY}
                  width={barWidth}
                  height={Math.max(1, confHeight)}
                  rx="1.5"
                  fill="#10b981"
                  opacity={hoveredIndex === null || isHovered ? 1 : 0.45}
                />

                {/* X-axis Tilted Label */}
                <text
                  x={centerX}
                  y={paddingTop + chartHeight + 14}
                  textAnchor="end"
                  transform={`rotate(-40, ${centerX}, ${paddingTop + chartHeight + 14})`}
                  className={`text-[9.5px] select-none transition-colors ${
                    isHovered
                      ? isDark
                        ? 'fill-white font-bold'
                        : 'fill-slate-900 font-bold'
                      : isDark
                      ? 'fill-slate-400 font-medium'
                      : 'fill-slate-400 font-medium'
                  }`}
                >
                  {item.label}
                </text>
              </g>
            );
          })}

          {/* Profit Line (Orange) */}
          <path
            d={pathD}
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Profit Line Markers */}
          {profitPoints.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <circle
                key={`circle-${i}`}
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 4.5 : 2.5}
                fill={isHovered ? '#ea580c' : '#f97316'}
                stroke={isDark ? '#0b101e' : '#ffffff'}
                strokeWidth="1.5"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIndex(i)}
                onClick={() => setHoveredIndex(isHovered ? null : i)}
              />
            );
          })}
        </svg>

        {/* Hover / Touch Tooltip overlay */}
        {hoveredItem && hoveredPoint && (
          <div
            className={`absolute z-20 pointer-events-none rounded-xl shadow-lg border p-3 text-xs min-w-44 transition-all ${
              isDark
                ? 'bg-[#151c2f] border-slate-750 text-slate-100 shadow-slate-950/80'
                : 'bg-white border-slate-200/90 text-slate-900'
            }`}
            style={{
              left: `${Math.min(75, Math.max(10, (hoveredPoint.x / svgWidth) * 100))}%`,
              top: `${Math.max(8, (hoveredPoint.y / svgHeight) * 100 - 35)}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <p
              className={`font-bold text-xs leading-tight mb-2 pb-1.5 truncate border-b ${
                isDark ? 'border-slate-800 text-white' : 'border-slate-100 text-[#1e293b]'
              }`}
            >
              {hoveredItem.fullName || hoveredItem.label}
            </p>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between gap-3">
                <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                  Delivered
                </span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {hoveredItem.delivered}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  Confirmed
                </span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {hoveredItem.confirmed}
                </span>
              </div>
              <div
                className={`flex items-center justify-between gap-3 pt-0.5 border-t ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span className="w-2 h-2 rounded-full bg-[#f97316]" />
                  Profit
                </span>
                <span className="font-bold text-[#ea580c]">
                  {formatTooltipCurrency(hoveredItem.profit)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
