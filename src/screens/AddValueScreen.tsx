/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Check, Layers, ChevronDown } from 'lucide-react';
import { AppBar } from '../components/common/AppBar';
import { SystemValue } from '../types';

interface AddValueScreenProps {
  onBack: () => void;
  onSaveValue: (newValue: Omit<SystemValue, 'id'>) => void;
  existingParentCodes?: string[];
}

const DEFAULT_PARENT_CODES = [
  'AccountType',
  'Advance Payment Reference Type',
  'Agent Name',
  'ApplicableOn',
  'Artwork Document Type',
];

export const AddValueScreen: React.FC<AddValueScreenProps> = ({
  onBack,
  onSaveValue,
  existingParentCodes = DEFAULT_PARENT_CODES,
}) => {
  const [parentCode, setParentCode] = useState('');
  const [valueName, setValueName] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCustomParent, setIsCustomParent] = useState(false);
  const [customParentCode, setCustomParentCode] = useState('');

  // Combine default and existing parent codes uniquely
  const parentOptions = Array.from(
    new Set([...DEFAULT_PARENT_CODES, ...existingParentCodes])
  ).filter(Boolean);

  const validate = () => {
    const errs: Record<string, string> = {};
    const effectiveParentCode = isCustomParent ? customParentCode.trim() : parentCode.trim();

    if (!effectiveParentCode) {
      errs.parentCode = 'Parent Code is required';
    }
    if (!valueName.trim()) {
      errs.valueName = 'Value Name is required';
    }
    if (!displayOrder.toString().trim()) {
      errs.displayOrder = 'Display Order is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const effectiveParentCode = isCustomParent ? customParentCode.trim() : parentCode.trim();

    onSaveValue({
      parentCode: effectiveParentCode,
      valueName: valueName.trim(),
      displayOrder: isNaN(Number(displayOrder)) ? displayOrder : Number(displayOrder),
      description: description.trim(),
      name: valueName.trim(),
      category: effectiveParentCode,
      status: 'Active',
      updatedAt: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="min-h-full pb-24 bg-[#f8fafc] text-slate-800">
      <AppBar
        title="Add Value"
        subtitle="Manage Values"
        showBack
        onBack={onBack}
      />

      <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Page Header Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1e293b] tracking-tight">
              Add Value
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Define lookup value parameters and display order.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7 space-y-5"
        >
          {/* Field 1: Parent Code */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="parent-code-select"
                className="text-xs font-bold text-slate-700 block"
              >
                Parent Code
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomParent(!isCustomParent);
                  setErrors((prev) => ({ ...prev, parentCode: '' }));
                }}
                className="text-[11px] text-blue-600 hover:underline font-medium cursor-pointer"
              >
                {isCustomParent ? 'Select from list' : '+ Enter new parent code'}
              </button>
            </div>

            {isCustomParent ? (
              <input
                id="custom-parent-code"
                type="text"
                value={customParentCode}
                onChange={(e) => setCustomParentCode(e.target.value)}
                placeholder="Enter new Parent code"
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] transition-all ${
                  errors.parentCode ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
            ) : (
              <div className="relative">
                <select
                  id="parent-code-select"
                  value={parentCode}
                  onChange={(e) => setParentCode(e.target.value)}
                  className={`w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] pr-9 transition-all ${
                    errors.parentCode ? 'border-rose-400' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select Parent code</option>
                  {parentOptions.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            )}
            {errors.parentCode && (
              <p className="text-[11px] text-rose-500 font-medium mt-1">
                {errors.parentCode}
              </p>
            )}
          </div>

          {/* Field 2: Value Name * */}
          <div className="space-y-1.5">
            <label
              htmlFor="value-name-input"
              className="text-xs font-bold text-slate-700 block"
            >
              Value Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="value-name-input"
              type="text"
              value={valueName}
              onChange={(e) => setValueName(e.target.value)}
              placeholder="Enter Value Name"
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] transition-all ${
                errors.valueName ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.valueName && (
              <p className="text-[11px] text-rose-500 font-medium mt-1">
                {errors.valueName}
              </p>
            )}
          </div>

          {/* Field 3: Display Order * */}
          <div className="space-y-1.5">
            <label
              htmlFor="display-order-input"
              className="text-xs font-bold text-slate-700 block"
            >
              Display Order <span className="text-rose-500">*</span>
            </label>
            <input
              id="display-order-input"
              type="text"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              placeholder="Enter Display Order"
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] transition-all ${
                errors.displayOrder ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.displayOrder && (
              <p className="text-[11px] text-rose-500 font-medium mt-1">
                {errors.displayOrder}
              </p>
            )}
          </div>

          {/* Field 4: Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="description-textarea"
              className="text-xs font-bold text-slate-700 block"
            >
              Description
            </label>
            <textarea
              id="description-textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] resize-y transition-all"
            />
          </div>

          {/* Action Button: Submit (matching reference image) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              id="add-value-submit-btn"
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1e293b] hover:bg-[#0f172a] active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Submit</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
