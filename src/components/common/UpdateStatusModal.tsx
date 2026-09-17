/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { X, ChevronDown, Calendar } from 'lucide-react';

export type UpdateStatusOption = 'Confirmed' | 'Revert - Send Back';

export interface UpdateStatusPayload {
  status: UpdateStatusOption;
  followUp: boolean;
  followUpDate: string;
  followUpAction: string;
  reason: string;
  comments: string;
}

const STATUS_OPTIONS: UpdateStatusOption[] = ['Confirmed', 'Revert - Send Back'];

const REASON_OPTIONS = [
  'NO ADVANCE RECD.',
  'DOCS INCOMPLETE',
  'PRICE MISMATCH',
  'CUSTOMER REQUEST',
  'OTHER',
] as const;

interface StatusFormErrors {
  status?: string;
  reason?: string;
  comments?: string;
  followUpDate?: string;
  followUpAction?: string;
}

interface UpdateStatusModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: UpdateStatusPayload) => void;
  onValidationError?: () => void;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  open,
  onClose,
  onSubmit,
  onValidationError,
}) => {
  const [statusOption, setStatusOption] = useState<UpdateStatusOption | ''>('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [reasonOption, setReasonOption] = useState('');
  const [reasonDropdownOpen, setReasonDropdownOpen] = useState(false);
  const [followUp, setFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpAction, setFollowUpAction] = useState('');
  const [statusComments, setStatusComments] = useState('');
  const [formErrors, setFormErrors] = useState<StatusFormErrors>({});

  const isRevert = statusOption === 'Revert - Send Back';

  useEffect(() => {
    if (!open) return;
    setStatusOption('');
    setStatusDropdownOpen(false);
    setReasonOption('');
    setReasonDropdownOpen(false);
    setFollowUp(false);
    setFollowUpDate('');
    setFollowUpAction('');
    setStatusComments('');
    setFormErrors({});
  }, [open]);

  if (!open) return null;

  const validate = (): StatusFormErrors => {
    const errors: StatusFormErrors = {};
    if (!statusOption) errors.status = 'Field is Required';
    if (isRevert && !reasonOption) errors.reason = 'Field is Required';
    if (isRevert && !statusComments.trim()) errors.comments = 'Field is Required';
    if (followUp && !followUpDate) errors.followUpDate = 'Field is Required';
    if (followUp && !followUpAction.trim()) errors.followUpAction = 'Field is Required';
    return errors;
  };

  const handleSubmit = () => {
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0 || !statusOption) {
      onValidationError?.();
      return;
    }
    onSubmit({
      status: statusOption,
      followUp,
      followUpDate,
      followUpAction: followUpAction.trim(),
      reason: reasonOption,
      comments: statusComments.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="text-base font-bold text-slate-900">Update Status</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-slate-700">
                Status <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setStatusDropdownOpen((v) => !v);
                    setReasonDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border bg-white text-left text-sm cursor-pointer ${
                    formErrors.status ? 'border-rose-400' : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <span className={statusOption ? 'font-semibold text-slate-900' : 'text-slate-400'}>
                    {statusOption || 'Select Status'}
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    {statusOption && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusOption('');
                          setReasonOption('');
                          setFormErrors((prev) => ({ ...prev, status: undefined, reason: undefined }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            setStatusOption('');
                            setReasonOption('');
                          }
                        }}
                        className="p-0.5 rounded text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </span>
                </button>
                {statusDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-30 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setStatusOption(opt);
                          setStatusDropdownOpen(false);
                          if (opt !== 'Revert - Send Back') setReasonOption('');
                          setFormErrors((prev) => ({
                            ...prev,
                            status: undefined,
                            reason: undefined,
                            comments: undefined,
                          }));
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                          statusOption === opt
                            ? 'bg-sky-50 text-sky-800'
                            : 'text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.status && (
                <p className="text-label font-semibold text-rose-500">{formErrors.status}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Follow Up</label>
              <button
                type="button"
                onClick={() => {
                  setFollowUp((v) => {
                    if (v) {
                      setFollowUpDate('');
                      setFollowUpAction('');
                      setFormErrors((prev) => ({
                        ...prev,
                        followUpDate: undefined,
                        followUpAction: undefined,
                      }));
                    }
                    return !v;
                  });
                }}
                className="flex items-center gap-2 h-[42px] cursor-pointer"
                aria-pressed={followUp}
              >
                <span
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    followUp ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      followUp ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </span>
                <span className="text-xs font-bold text-slate-600">{followUp ? 'YES' : 'NO'}</span>
              </button>
            </div>

            {followUp && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Follow Up Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => {
                        setFollowUpDate(e.target.value);
                        setFormErrors((prev) => ({ ...prev, followUpDate: undefined }));
                      }}
                      className={`w-full px-3 py-2.5 pr-10 rounded-xl border text-sm text-slate-800 outline-hidden focus:ring-2 focus:ring-[#0f2b3c]/30 ${
                        formErrors.followUpDate ? 'border-rose-400' : 'border-slate-300'
                      }`}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  {formErrors.followUpDate && (
                    <p className="text-label font-semibold text-rose-500">{formErrors.followUpDate}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Follow Up Action <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={followUpAction}
                    onChange={(e) => {
                      setFollowUpAction(e.target.value);
                      setFormErrors((prev) => ({ ...prev, followUpAction: undefined }));
                    }}
                    placeholder="Enter Follow Up Action"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#0f2b3c]/30 ${
                      formErrors.followUpAction ? 'border-rose-400' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.followUpAction && (
                    <p className="text-label font-semibold text-rose-500">{formErrors.followUpAction}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {isRevert && (
            <div className="space-y-1.5 relative max-w-md">
              <label className="text-xs font-bold text-slate-700">
                Reason <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setReasonDropdownOpen((v) => !v);
                    setStatusDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border bg-white text-left text-sm cursor-pointer ${
                    formErrors.reason ? 'border-rose-400' : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <span className={reasonOption ? 'font-semibold text-slate-900' : 'text-slate-400'}>
                    {reasonOption || 'Select Reason'}
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    {reasonOption && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setReasonOption('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            setReasonOption('');
                          }
                        }}
                        className="p-0.5 rounded text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </span>
                </button>
                {reasonDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-30 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                    {REASON_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setReasonOption(opt);
                          setReasonDropdownOpen(false);
                          setFormErrors((prev) => ({ ...prev, reason: undefined }));
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                          reasonOption === opt
                            ? 'bg-sky-50 text-sky-800'
                            : 'text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.reason && (
                <p className="text-label font-semibold text-rose-500">{formErrors.reason}</p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Comments {isRevert && <span className="text-rose-500">*</span>}
            </label>
            <textarea
              value={statusComments}
              onChange={(e) => {
                setStatusComments(e.target.value);
                setFormErrors((prev) => ({ ...prev, comments: undefined }));
              }}
              rows={4}
              placeholder="Enter Comments"
              className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0f2b3c]/30 outline-hidden resize-y min-h-[96px] ${
                formErrors.comments ? 'border-rose-400' : 'border-slate-300'
              }`}
            />
            {formErrors.comments && (
              <p className="text-label font-semibold text-rose-500">{formErrors.comments}</p>
            )}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex justify-end sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0f2b3c] hover:bg-[#1a3d52] cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
