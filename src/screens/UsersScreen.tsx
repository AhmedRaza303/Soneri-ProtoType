/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Filter,
  Settings,
  Search,
  ArrowUpDown,
  MoreVertical,
  Check,
  X,
  Eye,
  Edit,
  Power,
  PowerOff,
  ChevronLeft,
  ChevronRight,
  Shield,
  Building2,
  Mail,
  UserCheck,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
} from 'lucide-react';
import { AppBar } from '../components/common/AppBar';
import { User } from '../types';

interface UsersScreenProps {
  users: User[];
  onBack: () => void;
  onAddUserClick: () => void;
  onModifyUser: (user: User) => void;
  onToggleUserStatus: (user: User) => void;
}

type SortField = 'fullName' | 'email';
type SortOrder = 'asc' | 'desc';

interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  visible: boolean;
}

export const UsersScreen: React.FC<UsersScreenProps> = ({
  users,
  onBack,
  onAddUserClick,
  onModifyUser,
  onToggleUserStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('fullName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filters state
  const [roleFilter, setRoleFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [twoFAFilter, setTwoFAFilter] = useState('All');

  // Column visibility state
  const [columns, setColumns] = useState<ColumnDef[]>([
    { key: 'fullName', label: 'Full Name', sortable: true, visible: true },
    { key: 'email', label: 'Email', sortable: true, visible: true },
    { key: 'role', label: 'Role', visible: true },
    { key: 'nationality', label: 'Nationality', visible: true },
    { key: 'department', label: 'Department', visible: true },
    { key: 'designation', label: 'Designation', visible: true },
    { key: 'employmentType', label: 'Employement Type', visible: true },
    { key: '2fa', label: '(2FA) Authentication', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ]);

  const toggleColumnVisibility = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filtered & sorted users
  const filteredUsers = useMemo(() => {
    let result = users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (u.fullName && u.fullName.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.role && u.role.toLowerCase().includes(q)) ||
        (u.department && u.department.toLowerCase().includes(q)) ||
        (u.designation && u.designation.toLowerCase().includes(q));

      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      const matchesDept = departmentFilter === 'All' || u.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
      const matches2FA =
        twoFAFilter === 'All' ||
        (twoFAFilter === 'Yes' && u.enable2FA) ||
        (twoFAFilter === 'No' && !u.enable2FA);

      return matchesSearch && matchesRole && matchesDept && matchesStatus && matches2FA;
    });

    result.sort((a, b) => {
      const valA = (a[sortField] || '').toString().toLowerCase();
      const valB = (b[sortField] || '').toString().toLowerCase();
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    return result;
  }, [users, searchQuery, sortField, sortOrder, roleFilter, departmentFilter, statusFilter, twoFAFilter]);

  // Pagination calculation
  const totalRecords = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Available unique filter values
  const availableRoles = useMemo(() => {
    const set = new Set(users.map((u) => u.role).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [users]);

  const availableDepartments = useMemo(() => {
    const set = new Set(users.map((u) => u.department).filter((d) => d && d !== '-'));
    return ['All', ...Array.from(set)];
  }, [users]);

  const isAnyFilterActive =
    roleFilter !== 'All' ||
    departmentFilter !== 'All' ||
    statusFilter !== 'All' ||
    twoFAFilter !== 'All';

  const resetAllFilters = () => {
    setRoleFilter('All');
    setDepartmentFilter('All');
    setStatusFilter('All');
    setTwoFAFilter('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-full pb-20 bg-[#f8fafc] flex flex-col text-slate-800">
      {/* Top Mobile App Bar with Back and Direct Add User Action */}
      <AppBar
        title="Manage Users"
        subtitle={`${totalRecords} records found`}
        showBack
        onBack={onBack}
        rightAction={
          <button
            id="mobile-top-add-user-btn"
            type="button"
            onClick={onAddUserClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e293b] hover:bg-[#0f172a] text-white rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        }
      />

      <div className="p-3 sm:p-6 max-w-7xl mx-auto w-full flex-1 space-y-4">
        {/* Manage Users Header Banner matching Reference Image 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1e293b] tracking-tight">
              Manage Users
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin directory for enterprise identity, role clearance, and 2FA authentication.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="desktop-add-user-btn"
              type="button"
              onClick={onAddUserClick}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] hover:bg-[#0f172a] text-white rounded-xl text-sm font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Toolbar Bar with Filters, Columns, and Search input matching Image 1 */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Left Buttons: Filters and Columns */}
          <div className="flex items-center gap-2">
            {/* Filters Button */}
            <button
              id="btn-toolbar-filters"
              type="button"
              onClick={() => setShowFilterModal(!showFilterModal)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isAnyFilterActive || showFilterModal
                  ? 'bg-[#1e293b] text-white border-[#1e293b]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {isAnyFilterActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>

            {/* Columns Button */}
            <button
              id="btn-toolbar-columns"
              type="button"
              onClick={() => setShowColumnsModal(!showColumnsModal)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Columns</span>
            </button>

            {/* Mobile View Toggle (Card vs Table) */}
            <div className="sm:hidden ml-auto flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
                title="Table view"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
                title="Cards view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Search Input Box matching Image 1 */}
          <div className="relative flex-1 md:max-w-xs">
            <input
              id="user-grid-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search..."
              className="w-full pl-3.5 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e293b] focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Filters Dropdown / Collapsible Drawer */}
        {showFilterModal && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                Active Directory Filters
              </span>
              {isAnyFilterActive && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                >
                  Reset all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Role */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  {availableRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Department
                </label>
                <select
                  value={departmentFilter}
                  onChange={(e) => {
                    setDepartmentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  {availableDepartments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* 2FA Authentication */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  (2FA) Authentication
                </label>
                <select
                  value={twoFAFilter}
                  onChange={(e) => {
                    setTwoFAFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="All">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Columns Customizer Modal */}
        {showColumnsModal && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-slate-500" />
                Customize Table Columns
              </span>
              <button
                type="button"
                onClick={() => setShowColumnsModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {columns.map((col) => (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => toggleColumnVisibility(col.key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    col.visible
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {col.visible && <Check className="w-3 h-3" />}
                  <span>{col.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Table / Grid Container */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[950px]">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-600 font-semibold select-none">
                    {columns.find((c) => c.key === 'fullName')?.visible && (
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-950 transition-colors"
                        onClick={() => handleSort('fullName')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Full Name</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                    )}

                    {columns.find((c) => c.key === 'email')?.visible && (
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-950 transition-colors"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Email</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                    )}

                    {columns.find((c) => c.key === 'role')?.visible && (
                      <th className="py-3.5 px-4">Role</th>
                    )}

                    {columns.find((c) => c.key === 'nationality')?.visible && (
                      <th className="py-3.5 px-4">Nationality</th>
                    )}

                    {columns.find((c) => c.key === 'department')?.visible && (
                      <th className="py-3.5 px-4">Department</th>
                    )}

                    {columns.find((c) => c.key === 'designation')?.visible && (
                      <th className="py-3.5 px-4">Designation</th>
                    )}

                    {columns.find((c) => c.key === 'employmentType')?.visible && (
                      <th className="py-3.5 px-4">Employement Type</th>
                    )}

                    {columns.find((c) => c.key === '2fa')?.visible && (
                      <th className="py-3.5 px-4">(2FA) Authentication</th>
                    )}

                    {columns.find((c) => c.key === 'status')?.visible && (
                      <th className="py-3.5 px-4">Status</th>
                    )}

                    {columns.find((c) => c.key === 'actions')?.visible && (
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* Full Name */}
                        {columns.find((c) => c.key === 'fullName')?.visible && (
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-white text-[10px] font-bold ${
                                  user.avatarColor || 'bg-[#1e293b]'
                                }`}
                              >
                                {user.fullName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </div>
                              <span className="truncate max-w-[150px]">
                                {user.fullName}
                              </span>
                            </div>
                          </td>
                        )}

                        {/* Email */}
                        {columns.find((c) => c.key === 'email')?.visible && (
                          <td className="py-3.5 px-4 text-slate-600">
                            <span className="truncate block max-w-[200px]">
                              {user.email}
                            </span>
                          </td>
                        )}

                        {/* Role */}
                        {columns.find((c) => c.key === 'role')?.visible && (
                          <td className="py-3.5 px-4 text-slate-800">
                            {user.role || '-'}
                          </td>
                        )}

                        {/* Nationality */}
                        {columns.find((c) => c.key === 'nationality')?.visible && (
                          <td className="py-3.5 px-4 text-slate-500">
                            {user.nationality || '-'}
                          </td>
                        )}

                        {/* Department */}
                        {columns.find((c) => c.key === 'department')?.visible && (
                          <td className="py-3.5 px-4 text-slate-700">
                            {user.department || '-'}
                          </td>
                        )}

                        {/* Designation */}
                        {columns.find((c) => c.key === 'designation')?.visible && (
                          <td className="py-3.5 px-4 text-slate-500">
                            {user.designation || '-'}
                          </td>
                        )}

                        {/* Employement Type */}
                        {columns.find((c) => c.key === 'employmentType')?.visible && (
                          <td className="py-3.5 px-4 text-slate-500">
                            {user.employmentType || '-'}
                          </td>
                        )}

                        {/* (2FA) Authentication */}
                        {columns.find((c) => c.key === '2fa')?.visible && (
                          <td className="py-3.5 px-4">
                            {user.enable2FA !== false ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span>Yes</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                <span>No</span>
                              </span>
                            )}
                          </td>
                        )}

                        {/* Status */}
                        {columns.find((c) => c.key === 'status')?.visible && (
                          <td className="py-3.5 px-4">
                            {user.status === 'Active' ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span>Active</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                <span>Inactive</span>
                              </span>
                            )}
                          </td>
                        )}

                        {/* Actions */}
                        {columns.find((c) => c.key === 'actions')?.visible && (
                          <td className="py-3.5 px-4 text-right relative">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuUserId(
                                  activeMenuUserId === user.id ? null : user.id
                                )
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-slate-200/90 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer shadow-2xs"
                            >
                              <span>Actions</span>
                              <MoreVertical className="w-3 h-3 text-slate-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuUserId === user.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-20"
                                  onClick={() => setActiveMenuUserId(null)}
                                />
                                <div className="absolute right-4 top-11 z-30 w-36 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1 text-xs text-left select-none animate-in fade-in duration-100">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuUserId(null);
                                      setViewingUser(user);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-950 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                                    <span>View</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuUserId(null);
                                      onModifyUser(user);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-950 cursor-pointer"
                                  >
                                    <Edit className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Edit</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuUserId(null);
                                      onToggleUserStatus(user);
                                    }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer ${
                                      user.status === 'Active'
                                        ? 'text-rose-600 hover:bg-rose-50'
                                        : 'text-emerald-600 hover:bg-emerald-50'
                                    }`}
                                  >
                                    {user.status === 'Active' ? (
                                      <>
                                        <PowerOff className="w-3.5 h-3.5" />
                                        <span>Deactivate</span>
                                      </>
                                    ) : (
                                      <>
                                        <Power className="w-3.5 h-3.5" />
                                        <span>Activate</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        No users found matching the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Mobile Card View Alternative */
          <div className="space-y-3">
            {paginatedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs ${
                        user.avatarColor || 'bg-[#1e293b]'
                      }`}
                    >
                      {user.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {user.fullName}
                      </h4>
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveMenuUserId(
                        activeMenuUserId === user.id ? null : user.id
                      )
                    }
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-2.5">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">
                      Role
                    </span>
                    <span className="font-medium text-slate-700">{user.role || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">
                      Department
                    </span>
                    <span className="font-medium text-slate-700">{user.department || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">
                      2FA Auth
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {user.enable2FA !== false ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">
                      Status
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        user.status === 'Active'
                          ? 'text-emerald-700'
                          : 'text-rose-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'Active'
                            ? 'bg-emerald-500'
                            : 'bg-rose-500'
                        }`}
                      ></span>
                      {user.status}
                    </span>
                  </div>
                </div>

                {/* Card action buttons */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2.5">
                  <button
                    type="button"
                    onClick={() => setViewingUser(user)}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onModifyUser(user)}
                    className="px-2.5 py-1 text-xs font-semibold text-white bg-[#1e293b] rounded-lg hover:bg-slate-800"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Pagination and Records Count matching Reference Image 1 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2 px-1">
          {/* Left: Showing 1 to 10 of 83 records */}
          <div>
            Showing {totalRecords === 0 ? 0 : startIndex + 1} to {endIndex} of{' '}
            {totalRecords} records
          </div>

          {/* Right: Pagination Navigation & Items per page */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`w-6 h-6 rounded-md text-xs font-semibold transition-colors ${
                      currentPage === p
                        ? 'border border-blue-500 text-blue-600 bg-blue-50/50'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              {totalPages > 5 && (
                <>
                  <span className="px-1 text-slate-400">...</span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-6 h-6 rounded-md text-xs font-semibold transition-colors ${
                      currentPage === totalPages
                        ? 'border border-blue-500 text-blue-600 bg-blue-50/50'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Page Size Selector matching Image 1: 10 / page ⌵ */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick View Details Modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                    viewingUser.avatarColor || 'bg-[#1e293b]'
                  }`}
                >
                  {viewingUser.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {viewingUser.fullName}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    @{viewingUser.username || viewingUser.email.split('@')[0]}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingUser(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Data based on Image 1 & 2 */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-800">{viewingUser.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Role</span>
                <span className="font-semibold text-slate-800">{viewingUser.role}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Department</span>
                <span className="font-semibold text-slate-800">
                  {viewingUser.department || '-'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Designation</span>
                <span className="font-semibold text-slate-800">
                  {viewingUser.designation || '-'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Nationality</span>
                <span className="font-semibold text-slate-800">
                  {viewingUser.nationality || '-'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Employement Type</span>
                <span className="font-semibold text-slate-800">
                  {viewingUser.employmentType || '-'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">(2FA) Authentication</span>
                <span className="font-semibold text-emerald-700">
                  {viewingUser.enable2FA !== false ? '● Yes' : '● No'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Status</span>
                <span
                  className={`font-semibold ${
                    viewingUser.status === 'Active'
                      ? 'text-emerald-700'
                      : 'text-rose-600'
                  }`}
                >
                  ● {viewingUser.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const target = viewingUser;
                  setViewingUser(null);
                  onModifyUser(target);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1e293b] rounded-xl hover:bg-[#0f172a]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
