/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  Layers,
  FileText,
  Hash,
  FolderOpen,
  Folder,
  Sliders,
} from 'lucide-react';
import { AppBar } from '../components/common/AppBar';
import { SystemValue } from '../types';

interface ManageValuesScreenProps {
  systemValues: SystemValue[];
  onBack: () => void;
  onAddValueClick: () => void;
  onModifyValue: (val: SystemValue) => void;
  onDeleteValue?: (val: SystemValue) => void;
  onToggleValueStatus?: (val: SystemValue) => void;
}

export const ManageValuesScreen: React.FC<ManageValuesScreenProps> = ({
  systemValues,
  onBack,
  onAddValueClick,
  onModifyValue,
  onDeleteValue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    AccountType: true,
  });

  // Group values by Parent Code
  const groupedValues = useMemo(() => {
    const groups: Record<string, SystemValue[]> = {};

    systemValues.forEach((val) => {
      const parent = val.parentCode || val.category || 'General';
      if (!groups[parent]) {
        groups[parent] = [];
      }
      groups[parent].push(val);
    });

    // Sort items inside groups by displayOrder
    Object.keys(groups).forEach((parent) => {
      groups[parent].sort((a, b) => {
        const orderA = Number(a.displayOrder) || 0;
        const orderB = Number(b.displayOrder) || 0;
        return orderA - orderB;
      });
    });

    return groups;
  }, [systemValues]);

  // Filter groups based on search query
  const filteredGroups: Record<string, SystemValue[]> = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return groupedValues;

    const filtered: Record<string, SystemValue[]> = {};

    (Object.keys(groupedValues) as string[]).forEach((parent) => {
      const items = groupedValues[parent] || [];
      const parentMatches = parent.toLowerCase().includes(query);
      const matchingItems = items.filter(
        (item: SystemValue) =>
          item.valueName?.toLowerCase().includes(query) ||
          item.name?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          String(item.displayOrder).includes(query)
      );

      if (parentMatches || matchingItems.length > 0) {
        filtered[parent] = parentMatches ? items : matchingItems;
      }
    });

    return filtered;
  }, [groupedValues, searchQuery]);

  const toggleGroup = (parent: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [parent]: !prev[parent],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    Object.keys(groupedValues).forEach((key) => {
      allExpanded[key] = true;
    });
    setExpandedGroups(allExpanded);
  };

  const collapseAll = () => {
    setExpandedGroups({});
  };

  const totalValuesCount = systemValues.length;
  const parentCodesCount = Object.keys(groupedValues).length;

  return (
    <div className="min-h-full pb-24 bg-[#f8fafc] text-slate-800">
      {/* Top App Bar */}
      <AppBar
        title="Manage Values"
        subtitle="Manage system master values"
        showBack
        onBack={onBack}
        rightAction={
          <button
            id="values-add-button-top"
            type="button"
            onClick={onAddValueClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e293b] hover:bg-[#0f172a] text-white rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Value</span>
          </button>
        }
      />

      <main className="max-w-4xl mx-auto p-3.5 sm:p-6 space-y-4">
        {/* Header Banner matching Reference Image 14 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1e293b] tracking-tight">
              Manage Values
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure system parameter lookups organized by parent codes.
            </p>
          </div>
          <button
            id="manage-values-add-btn"
            type="button"
            onClick={onAddValueClick}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#1e293b] hover:bg-[#0f172a] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Value</span>
          </button>
        </div>

        {/* Values Container Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Values Section Header & Search Toolbar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#1e293b] tracking-tight">
                Values
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                {totalValuesCount}
              </span>
            </div>

            {/* Search Input matching reference image: Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="values-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Expand / Collapse Controls */}
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 bg-white">
            <span>
              {Object.keys(filteredGroups).length} Parent Code{Object.keys(filteredGroups).length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={expandAll}
                className="hover:text-slate-900 font-medium cursor-pointer"
              >
                Expand all
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={collapseAll}
                className="hover:text-slate-900 font-medium cursor-pointer"
              >
                Collapse all
              </button>
            </div>
          </div>

          {/* Hierarchical Grouped List matching Reference Image 14 */}
          <div className="divide-y divide-slate-100">
            {Object.keys(filteredGroups).length === 0 ? (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <Search className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
                <p className="text-sm font-semibold text-slate-700">No values found</p>
                <p className="text-xs text-slate-400">
                  {searchQuery ? `No records matching "${searchQuery}"` : 'No values registered yet.'}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-blue-600 font-semibold hover:underline mt-2 inline-block cursor-pointer"
                  >
                    Clear search filter
                  </button>
                )}
              </div>
            ) : (
              (Object.entries(filteredGroups) as [string, SystemValue[]][]).map(([parentCode, items]) => {
                const isExpanded = !!expandedGroups[parentCode] || !!searchQuery;

                return (
                  <div key={parentCode} className="transition-colors">
                    {/* Parent Code Accordion Row */}
                    <button
                      type="button"
                      onClick={() => toggleGroup(parentCode)}
                      className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors cursor-pointer ${
                        isExpanded ? 'bg-slate-50/70' : 'hover:bg-slate-50/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-slate-500">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                          {parentCode}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full shrink-0 ml-2">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </span>
                    </button>

                    {/* Children List: Value Name, Display Order, Description, and Actions */}
                    {isExpanded && (
                      <div className="bg-white pl-4 sm:pl-9 pr-4 py-1 divide-y divide-slate-100">
                        {items.map((val) => {
                          const displayName = val.valueName || val.name;
                          const displayOrderVal = val.displayOrder ?? '-';
                          const displayDesc = val.description || '';

                          return (
                            <div
                              key={val.id}
                              className="py-3 group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/80 -mx-2 px-3 rounded-xl transition-all"
                            >
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                                    {displayName}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md">
                                    Order: #{displayOrderVal}
                                  </span>
                                </div>
                                {displayDesc && (
                                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                    {displayDesc}
                                  </p>
                                )}
                              </div>

                              {/* Actions: Edit (Pencil) & Delete (Red Trash) matching Reference Image 14 */}
                              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                <button
                                  type="button"
                                  title="Edit Value"
                                  onClick={() => onModifyValue(val)}
                                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                {onDeleteValue && (
                                  <button
                                    type="button"
                                    title="Delete Value"
                                    onClick={() => onDeleteValue(val)}
                                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
