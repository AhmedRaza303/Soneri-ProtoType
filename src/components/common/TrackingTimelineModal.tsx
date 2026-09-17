/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { X, ChevronDown, ChevronUp, Play } from 'lucide-react';
import {
  ContainerTrackingItem,
  TrackingRouteStop,
} from '../../data/erpWorkstreamsData';

type TimelineTab = 'route' | 'vessel' | 'containers' | 'route_logs';

interface TrackingTimelineModalProps {
  open: boolean;
  item: ContainerTrackingItem | null;
  onClose: () => void;
}

function formatSummaryDate(raw: string, prefix: string) {
  if (!raw || raw === '-') return `${prefix} -`;
  // Accept YYYY-MM-DD or already formatted
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = Number(m[3]);
    const mon = months[Number(m[2]) - 1];
    return `${prefix} ${day} ${mon} ${m[1]}`;
  }
  return `${prefix} ${raw}`;
}

function RouteTimeline({
  stops,
  mutedPending = true,
}: {
  stops: TrackingRouteStop[];
  mutedPending?: boolean;
}) {
  return (
    <div className="relative pl-1">
      {stops.map((stop, sIdx) => {
        const isLast = sIdx === stops.length - 1;
        const portActive = stop.isCurrent || stop.isFinal || stop.events.some((e) => e.completed);
        return (
          <div key={`${stop.location}-${sIdx}`} className="relative flex gap-3 pb-1">
            {/* vertical rail */}
            <div className="flex flex-col items-center w-4 shrink-0">
              <span
                className={`mt-1 w-3.5 h-3.5 rounded-full border-2 bg-white z-10 ${
                  stop.isFinal || stop.isCurrent
                    ? 'border-blue-500'
                    : portActive
                    ? 'border-slate-700'
                    : 'border-slate-300'
                }`}
              />
              {!isLast && (
                <div className="flex-1 w-px bg-slate-200 min-h-[12px]" />
              )}
            </div>

            <div className={`flex-1 min-w-0 ${isLast ? 'pb-0' : 'pb-4'}`}>
              <p
                className={`text-sm font-bold mb-2 ${
                  stop.isFinal || stop.isCurrent ? 'text-blue-600' : 'text-slate-900'
                }`}
              >
                {stop.location}
              </p>
              <div className="space-y-2">
                {stop.events.map((ev, eIdx) => {
                  const dim = mutedPending && !ev.completed;
                  return (
                    <div key={`${ev.description}-${eIdx}`} className="flex items-start gap-2.5">
                      <span
                        className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                          ev.highlight
                            ? 'bg-blue-500'
                            : ev.completed
                            ? 'bg-slate-800'
                            : 'bg-slate-300'
                        }`}
                      />
                      <p
                        className={`flex-1 text-xs leading-snug ${
                          dim ? 'text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {ev.description}
                      </p>
                      <p
                        className={`text-xs whitespace-nowrap tabular-nums ${
                          dim ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {ev.date}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const TrackingTimelineModal: React.FC<TrackingTimelineModalProps> = ({
  open,
  item,
  onClose,
}) => {
  const isAlertScan = item?.trackingType === 'AlertScan';
  const [tab, setTab] = useState<TimelineTab>('route');
  const [exceptionOpen, setExceptionOpen] = useState(true);
  const [expandedContainer, setExpandedContainer] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !item) return;
    setTab('route');
    setExceptionOpen(true);
    setExpandedContainer(item.containersDetail[0]?.containerNumber ?? null);
  }, [open, item]);

  const tabs = useMemo(() => {
    const base: { id: TimelineTab; label: string }[] = [
      { id: 'route', label: 'Route' },
      { id: 'vessel', label: 'Vessel' },
      { id: 'containers', label: 'Containers' },
    ];
    if (isAlertScan) base.push({ id: 'route_logs', label: 'Route Logs' });
    return base;
  }, [isAlertScan]);

  if (!open || !item) return null;

  const progress = Math.min(100, Math.max(0, item.progressPercent));
  const leftDateLabel = item.atd && item.atd !== '-'
    ? formatSummaryDate(item.atd, 'ATD')
    : formatSummaryDate(item.atd, 'ETD');
  const rightDateLabel = item.ata
    ? formatSummaryDate(item.ata, 'ATA')
    : formatSummaryDate(item.eta, 'ETA');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px] cursor-pointer"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-lg max-h-[92vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 shrink-0">
          <h2 className="text-base font-bold text-slate-900">Tracking Timeline</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* summary card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-slate-900">BL {item.blNumber}</p>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <span className="text-xs font-semibold text-blue-600">{item.containerSpecLabel}</span>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide border ${
                    item.trackingApiStatus === 'DELIVERED'
                      ? 'bg-white border-slate-800 text-slate-900'
                      : item.trackingApiStatus === 'ERROR'
                      ? 'bg-rose-600 border-rose-600 text-white'
                      : 'bg-slate-800 border-slate-800 text-white'
                  }`}
                >
                  {item.trackingApiStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-800">
              <span className="truncate max-w-[45%]">{item.fromLocation}</span>
              <span className="truncate max-w-[45%] text-right">{item.toLocation}</span>
            </div>

            {/* progress track */}
            <div className="relative h-6 flex items-center">
              <div className="absolute left-0 right-0 h-0.5 border-t border-dashed border-slate-300" />
              <div
                className="absolute left-0 h-0.5 bg-[#1e3a8a]"
                style={{ width: `${progress}%` }}
              />
              <span className="absolute left-0 w-2.5 h-2.5 rounded-full bg-[#1e3a8a] border-2 border-white shadow-sm" />
              <span
                className="absolute -translate-x-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-[#1e3a8a] text-white shadow-sm"
                style={{ left: `${Math.max(8, Math.min(92, progress))}%` }}
              >
                <Play className="w-2.5 h-2.5 fill-current" />
              </span>
              <span
                className={`absolute right-0 w-2.5 h-2.5 rounded-full border-2 ${
                  progress >= 100
                    ? 'bg-[#1e3a8a] border-white'
                    : 'bg-white border-slate-300'
                }`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
              <span>{leftDateLabel}</span>
              <span>{rightDateLabel}</span>
            </div>
          </div>

          {/* Exception — AlertScan only */}
          {isAlertScan && item.exceptions && item.exceptions.length > 0 && (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setExceptionOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3.5 py-3 bg-white text-sm font-bold text-slate-900 cursor-pointer hover:bg-slate-50"
              >
                Exception
                {exceptionOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {exceptionOpen && (
                <div className="px-3.5 pb-3.5 space-y-3 border-t border-slate-100 bg-amber-50/40">
                  {item.exceptions.map((ex, idx) => (
                    <div key={idx} className="pt-3">
                      <p className="text-xs font-bold text-slate-900">
                        {idx + 1}. {ex.title}
                      </p>
                      <ul className="mt-1.5 space-y-0.5 pl-4 list-disc">
                        {ex.details.map((d, i) => (
                          <li key={i} className="text-xs text-slate-600">
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* tabs */}
          <div className="border-b border-slate-200 -mx-1 px-1">
            <div className="flex gap-4 overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`pb-2.5 text-sm font-semibold whitespace-nowrap cursor-pointer border-b-2 transition-colors ${
                    tab === t.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* tab panels */}
          {tab === 'route' && <RouteTimeline stops={item.routeStops} />}

          {tab === 'vessel' && (
            <div className="divide-y divide-slate-100">
              {item.vesselLegs.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No vessel legs available</p>
              ) : (
                item.vesselLegs.map((leg, idx) => (
                  <div key={idx} className="py-3.5 space-y-2 first:pt-0">
                    {(
                      [
                        ['Vessel', leg.vessel],
                        ['Voyage', leg.voyage],
                        ['Loading', leg.loading],
                        ['Discharge', leg.discharge],
                        ['ETD', leg.etd],
                        ['ETA', leg.eta],
                      ] as const
                    ).map(([label, value]) => (
                      <div key={label} className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                        <span className="font-bold text-slate-800">{label}</span>
                        <span className="text-slate-700">{value}</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'containers' && (
            <div className="space-y-3">
              {item.containersDetail.map((c) => {
                const openC = expandedContainer === c.containerNumber;
                return (
                  <div key={c.containerNumber} className="rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedContainer(openC ? null : c.containerNumber)
                      }
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 font-mono">
                          {c.containerNumber}
                        </span>
                        <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700">
                          {c.status}
                        </span>
                        <span className="text-[11px] text-slate-500">{c.sizeType}</span>
                      </div>
                      {openC ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {openC && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-100">
                        <RouteTimeline stops={c.route} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'route_logs' && isAlertScan && (
            <RouteTimeline stops={item.routeLogs ?? item.routeStops} />
          )}
        </div>
      </div>
    </div>
  );
};
