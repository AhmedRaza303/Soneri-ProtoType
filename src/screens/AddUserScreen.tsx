/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  UploadCloud,
  Eye,
  EyeOff,
  Plus,
  ArrowRight,
  ArrowLeft,
  Check,
  Building,
  FileText,
  CreditCard,
  User as UserIcon,
  HelpCircle,
  Bold,
  Italic,
  Underline,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import { AppBar } from '../components/common/AppBar';
import { User, BankAccount, ProfessionalInfo } from '../types';

interface AddUserScreenProps {
  onBack: () => void;
  onSaveUser: (newUser: Omit<User, 'id'>) => void;
}

export const AddUserScreen: React.FC<AddUserScreenProps> = ({
  onBack,
  onSaveUser,
}) => {
  // Tabs: 'userInfo' | 'bankDetails'
  const [activeTab, setActiveTab] = useState<'userInfo' | 'bankDetails'>('userInfo');

  // Personal Information State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [taxClass, setTaxClass] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordExpiryEnabled, setPasswordExpiryEnabled] = useState(false);
  const [passwordExpiryDays, setPasswordExpiryDays] = useState('');
  const [chartOfAccount, setChartOfAccount] = useState('');
  const [taxType, setTaxType] = useState('');
  const [taxNo, setTaxNo] = useState('');
  const [enable2FA, setEnable2FA] = useState(true);
  const [profilePhotoName, setProfilePhotoName] = useState<string | null>(null);

  // Employee Info State
  const [employmentType, setEmploymentType] = useState('');
  const [companyJoiningDate, setCompanyJoiningDate] = useState('');
  const [companyExitDateEnabled, setCompanyExitDateEnabled] = useState(false);
  const [companyExitDate, setCompanyExitDate] = useState('');

  // Professional Information #1 State
  const [professionalCompany, setProfessionalCompany] = useState('');
  const [professionalEmail, setProfessionalEmail] = useState('');
  const [professionalMobile, setProfessionalMobile] = useState('');
  const [professionalLandline, setProfessionalLandline] = useState('');
  const [professionalSignature, setProfessionalSignature] = useState('');
  const [professionalExtension, setProfessionalExtension] = useState('');

  // Additional professional sections count
  const [additionalProfCount, setAdditionalProfCount] = useState(0);

  // Documents & Canvas State
  const [selectedDocType, setSelectedDocType] = useState('CNIC');
  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: string }>({
    CNIC: 'cnic_front_back_scanned.pdf',
  });

  // Bank Details State (Bank Account #1)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: 'bank_1',
      currency: 'PKR',
      bankName: '',
      branchName: '',
      accountType: 'Current',
      accountTitle: '',
      accountNumber: '',
      ibanNumber: '',
      swiftCode: '',
      active: true,
      isPrimary: true,
    },
  ]);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateUserInfo = () => {
    const errs: Record<string, string> = {};

    if (!firstName.trim()) errs.firstName = 'First Name is required';
    if (!username.trim()) errs.username = 'Username is required';
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email';
    }
    if (!role) errs.role = 'Role is required';
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (confirmPassword && password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!chartOfAccount) {
      errs.chartOfAccount = 'Chart of Account is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateUserInfo()) {
      setActiveTab('bankDetails');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSave = () => {
    // Validate required fields in bank account #1
    const firstBank = bankAccounts[0];
    const errs: Record<string, string> = {};

    if (!firstBank.currency) errs.bankCurrency = 'Currency is required';
    if (!firstBank.bankName.trim()) errs.bankName = 'Bank Name is required';
    if (!firstBank.accountType) errs.accountType = 'Account Type is required';
    if (!firstBank.accountTitle.trim()) errs.accountTitle = 'Account Title is required';
    if (!firstBank.accountNumber.trim()) errs.accountNumber = 'Account Number is required';

    if (Object.keys(errs).length > 0) {
      setErrors((prev) => ({ ...prev, ...errs }));
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || firstName.trim();

    const professionalInfos: ProfessionalInfo[] = [
      {
        id: 'prof_1',
        company: professionalCompany || 'Soneri Group',
        emailAddress: professionalEmail || email,
        mobileNumber: professionalMobile,
        landlineNumber: professionalLandline,
        emailSignature: professionalSignature,
        extensionNumber: professionalExtension,
      },
    ];

    const newUser: Omit<User, 'id'> = {
      firstName,
      lastName,
      fullName,
      username,
      email,
      gender,
      dateOfBirth,
      nationality,
      taxClass,
      identityNumber,
      passportNumber,
      department,
      designation,
      role,
      password,
      confirmPassword,
      passwordExpiryEnabled,
      passwordExpiryDays,
      chartOfAccount,
      taxType,
      taxNo,
      enable2FA,
      profilePhoto: profilePhotoName || undefined,

      employmentType,
      companyJoiningDate,
      companyExitDateEnabled,
      companyExitDate,

      professionalInfos,
      bankAccounts,
      documents: uploadedDocs,

      status: 'Active',
      avatarColor: 'bg-[#1e293b]',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveUser(newUser);
  };

  const updateBankAccount = (index: number, field: keyof BankAccount, value: any) => {
    setBankAccounts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addAnotherBankAccount = () => {
    setBankAccounts((prev) => [
      ...prev,
      {
        id: `bank_${Date.now()}`,
        currency: 'PKR',
        bankName: '',
        branchName: '',
        accountType: 'Current',
        accountTitle: '',
        accountNumber: '',
        ibanNumber: '',
        swiftCode: '',
        active: true,
        isPrimary: false,
      },
    ]);
  };

  return (
    <div className="min-h-full pb-24 bg-[#f8fafc] text-slate-800">
      {/* Top App Bar */}
      <AppBar
        title="Add Users"
        showBack
        onBack={onBack}
        subtitle="New enterprise credential onboarding"
      />

      <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
        {/* Page Header matching Reference Image 2 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1e293b] tracking-tight">
              Add Users
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in user account parameters, credentials, role assignments, and bank details.
            </p>
          </div>
        </div>

        {/* Tab Navigation matching Image 2 & 3: User Info | Bank Details */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('userInfo')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'userInfo'
                ? 'border-[#1e293b] text-[#1e293b]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>User Info</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bankDetails')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'bankDetails'
                ? 'border-[#1e293b] text-[#1e293b]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Bank Details</span>
          </button>
        </div>

        {/* TAB 1: User Info */}
        {activeTab === 'userInfo' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Section 1: Personal Information */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
              <h2 className="text-sm font-bold text-[#1e293b] uppercase tracking-wider pb-2 border-b border-slate-100">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* First Name * */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter First Name"
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] ${
                      errors.firstName ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  {errors.firstName && (
                    <span className="text-[11px] text-rose-500 mt-1 block">
                      {errors.firstName}
                    </span>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter Last Name"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  />
                </div>

                {/* Username * */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter Username"
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] ${
                      errors.username ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  {errors.username && (
                    <span className="text-[11px] text-rose-500 mt-1 block">
                      {errors.username}
                    </span>
                  )}
                </div>

                {/* Email * */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] ${
                      errors.email ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  {errors.email && (
                    <span className="text-[11px] text-rose-500 mt-1 block">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                    />
                  </div>
                </div>

                {/* Nationality */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nationality
                  </label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  >
                    <option value="">Select Nationality</option>
                    <option value="Pakistani">Pakistani</option>
                    <option value="Emirati">Emirati</option>
                    <option value="Saudi">Saudi</option>
                    <option value="American">American</option>
                    <option value="British">British</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Tax Class */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tax Class
                  </label>
                  <select
                    value={taxClass}
                    onChange={(e) => setTaxClass(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  >
                    <option value="">Select Tax Class</option>
                    <option value="Salaried">Salaried</option>
                    <option value="Non-Salaried">Non-Salaried</option>
                    <option value="Filer">Filer</option>
                    <option value="Non-Filer">Non-Filer</option>
                    <option value="Exempt">Exempt</option>
                  </select>
                </div>

                {/* Identity Number */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Identity Number
                  </label>
                  <input
                    type="text"
                    value={identityNumber}
                    onChange={(e) => setIdentityNumber(e.target.value)}
                    placeholder="Enter Identity Number"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  />
                </div>

                {/* Passport Number */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Passport Number
                  </label>
                  <input
                    type="text"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    placeholder="Enter Passport Number"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  >
                    <option value="">Select Department</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Administration">Administration</option>
                    <option value="Export">Export</option>
                    <option value="IT">IT</option>
                  </select>
                </div>

                {/* Designation */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Designation
                  </label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  >
                    <option value="">Select Designation</option>
                    <option value="Manager">Manager</option>
                    <option value="Officer">Officer</option>
                    <option value="Executive">Executive</option>
                    <option value="Driver">Driver</option>
                    <option value="Director">Director</option>
                    <option value="Assistant">Assistant</option>
                  </select>
                </div>

                {/* Role * */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] ${
                      errors.role ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  >
                    <option value="">Select Role</option>
                    <option value="MasterAdmin">MasterAdmin</option>
                    <option value="Marketer - Export - Product">
                      Marketer - Export - Product
                    </option>
                    <option value="Default">Default</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Finance">Finance</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Sales">Sales</option>
                  </select>
                  {errors.role && (
                    <span className="text-[11px] text-rose-500 mt-1 block">
                      {errors.role}
                    </span>
                  )}
                </div>

                {/* Password * */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className={`w-full pl-3 pr-8 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] ${
                        errors.password ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-[11px] text-rose-500 mt-1 block">
                      {errors.password}
                    </span>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Enter Confirm Password"
                      className={`w-full pl-3 pr-8 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] ${
                        errors.confirmPassword ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-[11px] text-rose-500 mt-1 block">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>

                {/* Password Expiry (Toggle NO/YES + Input) */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Password Expiry
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPasswordExpiryEnabled(!passwordExpiryEnabled)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                        passwordExpiryEnabled
                          ? 'bg-[#1e293b] text-white border-[#1e293b]'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {passwordExpiryEnabled ? 'YES' : 'NO'}
                    </button>
                    <input
                      type="number"
                      disabled={!passwordExpiryEnabled}
                      value={passwordExpiryDays}
                      onChange={(e) => setPasswordExpiryDays(e.target.value)}
                      placeholder="Enter No. of Days"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>
                </div>

                {/* Chart of Account * */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Chart of Account <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={chartOfAccount}
                    onChange={(e) => setChartOfAccount(e.target.value)}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] ${
                      errors.chartOfAccount ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  >
                    <option value="">Select Chart of Account</option>
                    <option value="Assets">Assets</option>
                    <option value="Liabilities">Liabilities</option>
                    <option value="Equity">Equity</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Expenses">Expenses</option>
                  </select>
                  {errors.chartOfAccount && (
                    <span className="text-[11px] text-rose-500 mt-1 block">
                      {errors.chartOfAccount}
                    </span>
                  )}
                </div>

                {/* Tax Type */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tax Type
                  </label>
                  <select
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  >
                    <option value="">Select Tax Type</option>
                    <option value="Income Tax">Income Tax</option>
                    <option value="Sales Tax">Sales Tax</option>
                    <option value="Withholding Tax">Withholding Tax</option>
                    <option value="Exempt">Exempt</option>
                  </select>
                </div>

                {/* Tax No */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tax No
                  </label>
                  <input
                    type="text"
                    value={taxNo}
                    onChange={(e) => setTaxNo(e.target.value)}
                    placeholder="Enter Tax No"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  />
                </div>

                {/* Enable (2FA) Authentication (Toggle NO/YES) */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Enable (2FA) Authentication
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEnable2FA(!enable2FA)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                        enable2FA
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {enable2FA ? 'YES' : 'NO'}
                    </button>
                    <span className="text-xs text-slate-500">
                      {enable2FA ? 'OTP verification required' : 'Disabled'}
                    </span>
                  </div>
                </div>

                {/* Attach Profile Photo (Upload Box matching Image 2) */}
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Attach Profile Photo
                  </label>
                  <label className="border-2 border-dashed border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setProfilePhotoName(e.target.files[0].name);
                        }
                      }}
                    />
                    <UploadCloud className="w-6 h-6 text-slate-400" />
                    <span className="text-xs font-medium text-slate-600">
                      {profilePhotoName ? (
                        <span className="text-emerald-600 font-semibold">
                          Selected: {profilePhotoName}
                        </span>
                      ) : (
                        <>
                          <span className="text-slate-900 font-semibold">
                            Drop files to upload
                          </span>{' '}
                          or <span className="text-blue-600 underline">Click here</span>
                        </>
                      )}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 2: Employee Info */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
              <h2 className="text-sm font-bold text-[#1e293b] uppercase tracking-wider pb-2 border-b border-slate-100">
                Employee Info
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Employment Type */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  >
                    <option value="">Select Employment</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Probation">Probation</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>

                {/* Company Joining Date */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Company Joining Date
                  </label>
                  <input
                    type="date"
                    value={companyJoiningDate}
                    onChange={(e) => setCompanyJoiningDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  />
                </div>

                {/* Company Exit Date (Toggle NO/YES + Input) */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Company Exit Date
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCompanyExitDateEnabled(!companyExitDateEnabled)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                        companyExitDateEnabled
                          ? 'bg-[#1e293b] text-white border-[#1e293b]'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {companyExitDateEnabled ? 'YES' : 'NO'}
                    </button>
                    <input
                      type="date"
                      disabled={!companyExitDateEnabled}
                      value={companyExitDate}
                      onChange={(e) => setCompanyExitDate(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Professional Information #1 */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
              <h2 className="text-sm font-bold text-[#1e293b] uppercase tracking-wider pb-2 border-b border-slate-100">
                Professional Information #1
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Company */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Company
                  </label>
                  <select
                    value={professionalCompany}
                    onChange={(e) => setProfessionalCompany(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  >
                    <option value="">Select Company</option>
                    <option value="Soneri Group">Soneri Group</option>
                    <option value="Soneri International">Soneri International</option>
                    <option value="Soneri Fabrics">Soneri Fabrics</option>
                    <option value="Soneri Logistics">Soneri Logistics</option>
                  </select>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={professionalEmail}
                    onChange={(e) => setProfessionalEmail(e.target.value)}
                    placeholder="Enter Email Address"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  />
                </div>

                {/* Mobile Number with country prefix +92 */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Mobile Number
                  </label>
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#1e293b]">
                    <span className="px-2.5 py-2 bg-slate-100 text-xs font-semibold text-slate-600 border-r border-slate-200 flex items-center gap-1">
                      🇵🇰 +92
                    </span>
                    <input
                      type="tel"
                      value={professionalMobile}
                      onChange={(e) => setProfessionalMobile(e.target.value)}
                      placeholder="Mobile Number"
                      className="w-full px-3 py-2 text-xs bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Landline Number */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Landline Number
                  </label>
                  <input
                    type="text"
                    value={professionalLandline}
                    onChange={(e) => setProfessionalLandline(e.target.value)}
                    placeholder="(000)0000000"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  />
                </div>

                {/* Email Signature (Rich Formatting Bar) */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Signature
                  </label>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#1e293b]">
                    {/* Rich text formatting controls matching Image 2 */}
                    <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 text-slate-600 text-xs">
                      <button type="button" className="p-1 hover:bg-slate-200 rounded" title="Undo">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded" title="Redo">
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-px h-4 bg-slate-300 mx-1"></span>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded font-bold" title="Bold">
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded italic" title="Italic">
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded underline" title="Underline">
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-px h-4 bg-slate-300 mx-1"></span>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded" title="Align Left">
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded" title="Align Center">
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded" title="Align Right">
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-px h-4 bg-slate-300 mx-1"></span>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded" title="List">
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded" title="Insert Link">
                        <Link className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={professionalSignature}
                      onChange={(e) => setProfessionalSignature(e.target.value)}
                      placeholder="Type or paste your content here!"
                      className="w-full p-3 text-xs bg-white focus:outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Extension Number */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Extension Number
                  </label>
                  <input
                    type="text"
                    value={professionalExtension}
                    onChange={(e) => setProfessionalExtension(e.target.value)}
                    placeholder="Enter Extension Number"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  />
                </div>
              </div>

              {/* Add Another Professional Information Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setAdditionalProfCount((c) => c + 1)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#1e293b] text-white rounded-xl hover:bg-[#0f172a] active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Professional Information</span>
                </button>
              </div>
            </div>

            {/* Section 4: Split Panels: Documents (Left) and Canvas (Right) matching Image 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel: Documents */}
              <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
                <div className="bg-[#1e293b] px-4 py-3 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Documents</span>
                  <FileText className="w-4 h-4 text-slate-300" />
                </div>

                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Document Categories List */}
                    <div className="space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                      {[
                        'CNIC',
                        'Drivring License',
                        'Passport',
                        'Non Disclosure Agreement (NDA)',
                        'Emirates ID',
                      ].map((doc) => (
                        <button
                          key={doc}
                          type="button"
                          onClick={() => setSelectedDocType(doc)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                            selectedDocType === doc
                              ? 'bg-[#1e293b] text-white shadow-xs'
                              : 'text-slate-700 hover:bg-slate-200/60'
                          }`}
                        >
                          <span className="truncate">{doc}</span>
                          {uploadedDocs[doc] && (
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Upload Box for currently selected document */}
                    <div className="space-y-2 flex flex-col justify-center">
                      <span className="text-xs font-bold text-slate-800">
                        Upload {selectedDocType}
                      </span>
                      <label className="border-2 border-dashed border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setUploadedDocs((prev) => ({
                                ...prev,
                                [selectedDocType]: e.target.files![0].name,
                              }));
                            }
                          }}
                        />
                        <UploadCloud className="w-7 h-7 text-slate-400" />
                        <span className="text-xs font-medium text-slate-600">
                          {uploadedDocs[selectedDocType] ? (
                            <span className="text-emerald-600 font-semibold block break-all">
                              {uploadedDocs[selectedDocType]}
                            </span>
                          ) : (
                            <>
                              <span className="text-slate-900 font-semibold block">
                                Drop files to upload
                              </span>
                              or <span className="text-blue-600 underline">Click here</span>
                            </>
                          )}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Canvas */}
              <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
                <div className="bg-[#1e293b] px-4 py-3 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Canvas</span>
                  <HelpCircle className="w-4 h-4 text-slate-300" />
                </div>

                <div className="p-8 flex flex-col items-center justify-center min-h-[220px] text-center bg-slate-50/40">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs mb-3">
                    <FileText className="w-7 h-7 text-slate-400" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-700">Documents Preview</h4>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    {uploadedDocs[selectedDocType]
                      ? `Viewing ${selectedDocType} attached file (${uploadedDocs[selectedDocType]})`
                      : 'No document loaded in preview canvas.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Navigation for Tab 1: Next button */}
            <div className="flex items-center justify-end pt-3">
              <button
                id="btn-next-to-bank-details"
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1e293b] hover:bg-[#0f172a] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Bank Details */}
        {activeTab === 'bankDetails' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {bankAccounts.map((account, index) => (
              <div
                key={account.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-[#1e293b] uppercase tracking-wider">
                    Bank Account #{index + 1}
                  </h2>
                  {account.isPrimary && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      Primary Account
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Currency * */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Currency <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={account.currency}
                      onChange={(e) => updateBankAccount(index, 'currency', e.target.value)}
                      className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] ${
                        errors.bankCurrency ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    >
                      <option value="">Select Currency</option>
                      <option value="PKR">PKR</option>
                      <option value="USD">USD</option>
                      <option value="AED">AED</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                    {errors.bankCurrency && (
                      <span className="text-[11px] text-rose-500 mt-1 block">
                        {errors.bankCurrency}
                      </span>
                    )}
                  </div>

                  {/* Bank Name * */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Bank Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={account.bankName}
                      onChange={(e) => updateBankAccount(index, 'bankName', e.target.value)}
                      placeholder="Enter Bank Name"
                      className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] ${
                        errors.bankName ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.bankName && (
                      <span className="text-[11px] text-rose-500 mt-1 block">
                        {errors.bankName}
                      </span>
                    )}
                  </div>

                  {/* Branch Name */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      value={account.branchName || ''}
                      onChange={(e) => updateBankAccount(index, 'branchName', e.target.value)}
                      placeholder="Enter Branch Name"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                    />
                  </div>

                  {/* Account Type * */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Account Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={account.accountType}
                      onChange={(e) => updateBankAccount(index, 'accountType', e.target.value)}
                      className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] ${
                        errors.accountType ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    >
                      <option value="">Select Account Type</option>
                      <option value="Current">Current</option>
                      <option value="Savings">Savings</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Salary">Salary</option>
                    </select>
                    {errors.accountType && (
                      <span className="text-[11px] text-rose-500 mt-1 block">
                        {errors.accountType}
                      </span>
                    )}
                  </div>

                  {/* Account Title * */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Account Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={account.accountTitle}
                      onChange={(e) => updateBankAccount(index, 'accountTitle', e.target.value)}
                      placeholder="Enter Account Title"
                      className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] ${
                        errors.accountTitle ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.accountTitle && (
                      <span className="text-[11px] text-rose-500 mt-1 block">
                        {errors.accountTitle}
                      </span>
                    )}
                  </div>

                  {/* Account Number * */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Account Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={account.accountNumber}
                      onChange={(e) => updateBankAccount(index, 'accountNumber', e.target.value)}
                      placeholder="Enter Account Number"
                      className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] ${
                        errors.accountNumber ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.accountNumber && (
                      <span className="text-[11px] text-rose-500 mt-1 block">
                        {errors.accountNumber}
                      </span>
                    )}
                  </div>

                  {/* IBAN Number */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      IBAN Number
                    </label>
                    <input
                      type="text"
                      value={account.ibanNumber || ''}
                      onChange={(e) => updateBankAccount(index, 'ibanNumber', e.target.value)}
                      placeholder="Enter IBAN Number"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                    />
                  </div>

                  {/* SWIFT Code / BIC */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      SWIFT Code / BIC
                    </label>
                    <input
                      type="text"
                      value={account.swiftCode || ''}
                      onChange={(e) => updateBankAccount(index, 'swiftCode', e.target.value)}
                      placeholder="Enter SWIFT Code"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                    />
                  </div>

                  {/* Active (Badge Toggle matching Image 3) */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Active
                    </label>
                    <button
                      type="button"
                      onClick={() => updateBankAccount(index, 'active', !account.active)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        account.active
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {account.active && <Check className="w-3 h-3" />}
                      <span>{account.active ? 'YES' : 'NO'}</span>
                    </button>
                  </div>

                  {/* Is Primary (Badge Toggle matching Image 3) */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Is Primary
                    </label>
                    <button
                      type="button"
                      onClick={() => updateBankAccount(index, 'isPrimary', !account.isPrimary)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        account.isPrimary
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {account.isPrimary && <Check className="w-3 h-3" />}
                      <span>{account.isPrimary ? 'YES' : 'NO'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Another Bank Account Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={addAnotherBankAccount}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#1e293b] text-white rounded-xl hover:bg-[#0f172a] active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Bank Account</span>
              </button>
            </div>

            {/* Bottom Actions: Back to User Info & Save User */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('userInfo')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                id="btn-save-user-submit"
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1e293b] hover:bg-[#0f172a] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save User</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
