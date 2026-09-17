/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  UploadCloud,
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
  X,
} from 'lucide-react';
import { AppBar } from '../components/common/AppBar';
import { User, BankAccount, ProfessionalInfo } from '../types';

interface ModifyUserScreenProps {
  user: User;
  onBack: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const ModifyUserScreen: React.FC<ModifyUserScreenProps> = ({
  user,
  onBack,
  onUpdateUser,
}) => {
  // Tabs: 'userInfo' | 'bankDetails'
  const [activeTab, setActiveTab] = useState<'userInfo' | 'bankDetails'>('userInfo');

  // Pre-fill Personal Information
  const [firstName, setFirstName] = useState(
    user.firstName || user.fullName.split(' ')[0] || ''
  );
  const [lastName, setLastName] = useState(
    user.lastName || user.fullName.split(' ').slice(1).join(' ') || ''
  );
  const [username, setUsername] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [gender, setGender] = useState(user.gender || 'Male');
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth || '1992-05-14');
  const [nationality, setNationality] = useState(
    user.nationality && user.nationality !== '-' ? user.nationality : 'Pakistani'
  );
  const [taxClass, setTaxClass] = useState(user.taxClass || 'Salaried');
  const [identityNumber, setIdentityNumber] = useState(
    user.identityNumber || '35201-9988221-3'
  );
  const [passportNumber, setPassportNumber] = useState(
    user.passportNumber || 'PK882201'
  );
  const [department, setDepartment] = useState(
    user.department && user.department !== '-' ? user.department : 'Marketing'
  );
  const [designation, setDesignation] = useState(
    user.designation && user.designation !== '-' ? user.designation : 'Manager'
  );
  const [role, setRole] = useState(user.role || 'MasterAdmin');
  const [password] = useState(user.password || 'password123');
  const [confirmPassword] = useState(
    user.confirmPassword || user.password || 'password123'
  );
  const [passwordExpiryEnabled] = useState(
    user.passwordExpiryEnabled ?? true
  );
  const [passwordExpiryDays] = useState(
    user.passwordExpiryDays || '90'
  );
  const [chartOfAccount, setChartOfAccount] = useState(
    user.chartOfAccount || 'Revenue'
  );
  const [taxType, setTaxType] = useState(user.taxType || 'Income Tax');
  const [taxNo, setTaxNo] = useState(user.taxNo || 'NTN-884219');
  const [enable2FA, setEnable2FA] = useState(user.enable2FA ?? true);
  const [profilePhotoName, setProfilePhotoName] = useState<string | null>(
    user.profilePhoto || 'profile_photo.jpg'
  );

  // Pre-fill Employee Info
  const [employmentType, setEmploymentType] = useState(
    user.employmentType && user.employmentType !== '-'
      ? user.employmentType
      : 'Full Time'
  );
  const [companyJoiningDate, setCompanyJoiningDate] = useState(
    user.companyJoiningDate || '2023-01-10'
  );
  const [companyExitDateEnabled, setCompanyExitDateEnabled] = useState(
    user.companyExitDateEnabled ?? false
  );
  const [companyExitDate, setCompanyExitDate] = useState(
    user.companyExitDate || ''
  );

  // Pre-fill Professional Information (repeatable)
  const [professionalInfos, setProfessionalInfos] = useState<ProfessionalInfo[]>(
    user.professionalInfos && user.professionalInfos.length > 0
      ? user.professionalInfos
      : [
          {
            id: 'prof_1',
            company: 'Soneri Group',
            emailAddress: user.email || '',
            mobileNumber: user.phone || '300 8472910',
            landlineNumber: '(042)35789012',
            emailSignature:
              `${user.fullName}\n${user.role} - Soneri Group of Companies\nWeb: www.sonerigroup.com`,
            extensionNumber: '104',
          },
        ]
  );

  // Documents & Canvas State
  const [selectedDocType, setSelectedDocType] = useState('CNIC');
  const [canvasDocs, setCanvasDocs] = useState<
    {
      id: string;
      docType: string;
      fileName: string;
      previewUrl: string | null;
      expiryDate: string;
    }[]
  >(() => {
    const docs = user.documents || {};
    return Object.entries(docs).map(([docType, fileName], i) => ({
      id: `doc_existing_${i}`,
      docType,
      fileName,
      previewUrl: null,
      expiryDate: '',
    }));
  });
  const [activeCanvasDocId, setActiveCanvasDocId] = useState<string | null>(
    () => {
      const docs = user.documents || {};
      const keys = Object.keys(docs);
      return keys.length > 0 ? 'doc_existing_0' : null;
    }
  );

  // Bank Details State (Pre-filled matching Image 3)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(
    user.bankAccounts && user.bankAccounts.length > 0
      ? user.bankAccounts
      : [
          {
            id: 'bank_1',
            currency: 'PKR',
            bankName: 'Meezan Bank Ltd',
            branchName: 'Main Gulberg Branch',
            accountType: 'Corporate',
            accountTitle: `Soneri Group - ${user.fullName}`,
            accountNumber: '02010103456789',
            ibanNumber: 'PK36MEZN0002010103456789',
            swiftCode: 'MEZNPKKA',
            active: true,
            isPrimary: true,
          },
        ]
  );

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // If incoming user changes
    setFirstName(user.firstName || user.fullName.split(' ')[0] || '');
    setLastName(user.lastName || user.fullName.split(' ').slice(1).join(' ') || '');
    setUsername(user.username || '');
    setEmail(user.email || '');
    setRole(user.role || 'MasterAdmin');
  }, [user]);

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

  const handleUpdate = () => {
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

    const updatedUser: User = {
      ...user,
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
      documents: canvasDocs.reduce<Record<string, string>>((acc, doc) => {
        acc[doc.docType] = doc.fileName;
        return acc;
      }, {}),
    };

    onUpdateUser(updatedUser);
  };

  const updateProfessionalInfo = (index: number, field: keyof ProfessionalInfo, value: string) => {
    setProfessionalInfos((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addProfessionalInfo = () => {
    setProfessionalInfos((prev) => [
      ...prev,
      {
        id: `prof_${Date.now()}`,
        company: '',
        emailAddress: '',
        mobileNumber: '',
        landlineNumber: '',
        emailSignature: '',
        extensionNumber: '',
      },
    ]);
  };

  const activeCanvasDoc =
    canvasDocs.find((d) => d.id === activeCanvasDocId) ?? canvasDocs[0] ?? null;

  const handleDocUpload = (file: File) => {
    const id = `doc_${Date.now()}`;
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    const newDoc = {
      id,
      docType: selectedDocType,
      fileName: file.name,
      previewUrl,
      expiryDate: '',
    };
    setCanvasDocs((prev) => [...prev, newDoc]);
    setActiveCanvasDocId(id);
  };

  const removeCanvasDoc = (id: string) => {
    setCanvasDocs((prev) => {
      const target = prev.find((d) => d.id === id);
      if (target?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(target.previewUrl);
      }
      const next = prev.filter((d) => d.id !== id);
      setActiveCanvasDocId((current) => {
        if (current !== id) return current;
        return next[0]?.id ?? null;
      });
      return next;
    });
  };

  const updateCanvasDocExpiry = (id: string, expiryDate: string) => {
    setCanvasDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, expiryDate } : d))
    );
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
        title="Update User"
        showBack
        onBack={onBack}
        subtitle={`Updating account: ${user.fullName}`}
      />

      <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
        {/* Page Header matching Reference Image 3: Update User */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1e293b] tracking-tight">
              Update User
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Modify account parameters, personal details, employee credentials, and bank records.
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
                    <span className="text-body-sm text-rose-500 mt-1 block">
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
                    <span className="text-body-sm text-rose-500 mt-1 block">
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
                    <span className="text-body-sm text-rose-500 mt-1 block">
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
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  />
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
                    <span className="text-body-sm text-rose-500 mt-1 block">
                      {errors.role}
                    </span>
                  )}
                </div>

                {/* Password fields hidden on Edit User — only shown on Create New User */}

                {/* Chart of Account * */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Chart of Account <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={chartOfAccount}
                    onChange={(e) => setChartOfAccount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                  >
                    <option value="">Select Chart of Account</option>
                    <option value="Assets">Assets</option>
                    <option value="Liabilities">Liabilities</option>
                    <option value="Equity">Equity</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Expenses">Expenses</option>
                  </select>
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
                          Current: {profilePhotoName} (click to replace)
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

            {/* Section 3: Professional Information (repeatable) */}
            {professionalInfos.map((info, index) => (
              <div
                key={info.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5"
              >
                <h2 className="text-sm font-bold text-[#1e293b] uppercase tracking-wider pb-2 border-b border-slate-100">
                  Professional Information #{index + 1}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Company
                    </label>
                    <select
                      value={info.company}
                      onChange={(e) => updateProfessionalInfo(index, 'company', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                    >
                      <option value="">Select Company</option>
                      <option value="Soneri Group">Soneri Group</option>
                      <option value="Soneri International">Soneri International</option>
                      <option value="Soneri Fabrics">Soneri Fabrics</option>
                      <option value="Soneri Logistics">Soneri Logistics</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={info.emailAddress}
                      onChange={(e) => updateProfessionalInfo(index, 'emailAddress', e.target.value)}
                      placeholder="Enter Email Address"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                    />
                  </div>

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
                        value={info.mobileNumber}
                        onChange={(e) => updateProfessionalInfo(index, 'mobileNumber', e.target.value)}
                        placeholder="Mobile Number"
                        className="w-full px-3 py-2 text-xs bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Landline Number
                    </label>
                    <input
                      type="text"
                      value={info.landlineNumber}
                      onChange={(e) => updateProfessionalInfo(index, 'landlineNumber', e.target.value)}
                      placeholder="(000)0000000"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Email Signature
                    </label>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#1e293b]">
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
                        value={info.emailSignature}
                        onChange={(e) => updateProfessionalInfo(index, 'emailSignature', e.target.value)}
                        placeholder="Type or paste your content here!"
                        className="w-full p-3 text-xs bg-white focus:outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Extension Number
                    </label>
                    <input
                      type="text"
                      value={info.extensionNumber}
                      onChange={(e) => updateProfessionalInfo(index, 'extensionNumber', e.target.value)}
                      placeholder="Enter Extension Number"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                    />
                  </div>
                </div>

                {index === professionalInfos.length - 1 && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={addProfessionalInfo}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#1e293b] text-white rounded-xl hover:bg-[#0f172a] active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Another Professional Information</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Section 4: Split Panels: Documents (Left) and Canvas (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
                <div className="bg-[#1e293b] px-4 py-3 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Documents</span>
                  <FileText className="w-4 h-4 text-slate-300" />
                </div>

                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                              ? 'bg-slate-200/80 text-slate-900'
                              : 'text-slate-700 hover:bg-slate-200/60'
                          }`}
                        >
                          <span className="truncate">{doc}</span>
                          {canvasDocs.some((d) => d.docType === doc) && (
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2 flex flex-col justify-center">
                      <span className="text-xs font-bold text-slate-800">
                        Upload {selectedDocType}
                      </span>
                      <label className="border-2 border-dashed border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center min-h-[140px]">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleDocUpload(e.target.files[0]);
                              e.target.value = '';
                            }
                          }}
                        />
                        <UploadCloud className="w-7 h-7 text-blue-500" />
                        <span className="text-xs font-medium text-slate-600">
                          <span className="text-slate-900 font-semibold block">
                            Drop files to upload
                          </span>
                          or <span className="text-blue-600 underline">Click here</span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
                <div className="bg-[#1e293b] px-4 py-3 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Canvas</span>
                  <HelpCircle className="w-4 h-4 text-slate-300" />
                </div>

                <div className="p-4 min-h-[260px] bg-white space-y-3">
                  {canvasDocs.length > 0 ? (
                    <>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {canvasDocs.map((doc) => (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => setActiveCanvasDocId(doc.id)}
                            className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 bg-slate-50 cursor-pointer ${
                              activeCanvasDoc?.id === doc.id
                                ? 'border-[#1e293b]'
                                : 'border-slate-200 hover:border-slate-400'
                            }`}
                            title={doc.docType}
                          >
                            {doc.previewUrl ? (
                              <img
                                src={doc.previewUrl}
                                alt={doc.fileName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText className="w-6 h-6 text-slate-400" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      {activeCanvasDoc && (
                        <div className="rounded-lg border border-slate-200 bg-slate-100/80 p-3 space-y-3">
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div>
                              <p className="text-body-sm font-semibold text-slate-600">
                                Document Type
                              </p>
                              <p className="text-xs font-bold text-slate-800 mt-0.5">
                                {activeCanvasDoc.docType}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-body-sm font-semibold text-slate-600 whitespace-nowrap">
                                Expiry Date
                              </label>
                              <input
                                type="date"
                                value={activeCanvasDoc.expiryDate}
                                onChange={(e) =>
                                  updateCanvasDocExpiry(activeCanvasDoc.id, e.target.value)
                                }
                                className="px-2 py-1 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
                              />
                            </div>
                          </div>

                          <div className="relative inline-block">
                            {activeCanvasDoc.previewUrl ? (
                              <img
                                src={activeCanvasDoc.previewUrl}
                                alt={activeCanvasDoc.fileName}
                                className="max-h-44 max-w-full rounded border border-slate-300 object-contain bg-white"
                              />
                            ) : (
                              <div className="flex items-center gap-3 px-4 py-8 rounded border border-slate-300 bg-white min-w-[180px]">
                                <FileText className="w-8 h-8 text-slate-400 shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-700 truncate">
                                    {activeCanvasDoc.fileName}
                                  </p>
                                  <p className="text-body-sm text-slate-400">Document attached</p>
                                </div>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeCanvasDoc(activeCanvasDoc.id)}
                              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm hover:bg-rose-600 cursor-pointer"
                              title="Remove document"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                        <FileText className="w-7 h-7" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-700">Documents Preview</h4>
                      <p className="text-body-sm text-slate-400 mt-1 max-w-xs">
                        Upload a file to preview it here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Navigation for Tab 1: Next button */}
            <div className="flex items-center justify-end pt-3">
              <button
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

        {/* TAB 2: Bank Details matching Reference Image 3 */}
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
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-label font-bold border border-emerald-200">
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
                      <span className="text-body-sm text-rose-500 mt-1 block">
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
                      <span className="text-body-sm text-rose-500 mt-1 block">
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
                      <span className="text-body-sm text-rose-500 mt-1 block">
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
                      <span className="text-body-sm text-rose-500 mt-1 block">
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
                      <span className="text-body-sm text-rose-500 mt-1 block">
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

            {/* Bottom Actions: Back to User Info & Update Button matching Image 3 */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('userInfo')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              {/* Exact button label from Image 3: "Update" */}
              <button
                id="btn-update-user-submit"
                type="button"
                onClick={handleUpdate}
                className="flex items-center gap-2 px-7 py-2.5 bg-[#1e293b] hover:bg-[#0f172a] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Update</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
