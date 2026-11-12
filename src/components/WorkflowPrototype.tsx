import React, { useState } from 'react';
import { 
  Building2, Users, FileText, CheckCircle2, Clock, AlertCircle, 
  Search, Plus, GitMerge, Download, Printer, Filter, Shield, 
  Calendar, QrCode, ArrowRight, UserX, UserCheck, ExternalLink,
  ChevronRight, Sparkles, Layers, BookOpen, Settings
} from 'lucide-react';
import { Student, Company, TrainingActivity, Advisor } from '../types';
import { 
  initialCompanies, initialStudents, initialTrainings, 
  mockAdvisors, standardJobPositions, systemSettingsDefault 
} from '../data/mockInternshipData';
import { CompanyMergeModal } from './CompanyMergeModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { TrainingRegistrationModal } from './TrainingRegistrationModal';

export const WorkflowPrototype: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'trainings' | 'documents' | 'students' | 'settings'>('overview');
  
  // State management for prototype
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [trainings, setTrainings] = useState<TrainingActivity[]>(initialTrainings);
  const [settings, setSettings] = useState(systemSettingsDefault);
  
  // Filters
  const [selectedMajorFilter, setSelectedMajorFilter] = useState<string>('all');
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  // Modals state
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<{
    isOpen: boolean;
    type: 'request' | 'sending';
    student: Student | null;
    company?: Company;
  }>({
    isOpen: false,
    type: 'request',
    student: null
  });
  const [selectedTrainingModal, setSelectedTrainingModal] = useState<TrainingActivity | null>(null);

  // Drop student modal
  const [dropStudentModal, setDropStudentModal] = useState<{ isOpen: boolean; student: Student | null }>({
    isOpen: false,
    student: null
  });

  // Add Company modal
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [newCompanyForm, setNewCompanyForm] = useState({
    nameTh: '',
    nameEn: '',
    address: '',
    phone: '',
    email: '',
    contactPerson: '',
    contactPosition: '',
    position: standardJobPositions[0]
  });

  // Handler: Merge Companies
  const handleMergeCompanies = (masterId: string, duplicateIds: string[]) => {
    // 1. Mark duplicate companies as merged
    setCompanies(prev =>
      prev.map(c => {
        if (duplicateIds.includes(c.id)) {
          return { ...c, status: 'merged', mergedIntoId: masterId };
        }
        return c;
      })
    );

    // 2. Transfer students to master company
    setStudents(prev =>
      prev.map(s => {
        if (s.appliedCompanyId && duplicateIds.includes(s.appliedCompanyId)) {
          return { ...s, appliedCompanyId: masterId };
        }
        return s;
      })
    );
  };

  // Handler: Drop student
  const handleConfirmDropStudent = (studentId: string) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, status: 'dropped' } : s))
    );
    setDropStudentModal({ isOpen: false, student: null });
  };

  // Handler: Approve Acceptance Letter (2-stage: Advisor -> Admin P'Jom)
  const handleApproveAcceptance = (studentId: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          if (s.acceptanceLetterStatus === 'uploaded') {
            return { ...s, acceptanceLetterStatus: 'verified_advisor' };
          } else if (s.acceptanceLetterStatus === 'verified_advisor') {
            return { ...s, acceptanceLetterStatus: 'approved_admin', workflowStep: 5 };
          }
        }
        return s;
      })
    );
  };

  // Handler: Issue Sending Letter
  const handleIssueSendingLetter = (studentId: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            sendingLetterNumber: `อว 1713/ว.${Math.floor(Math.random() * 800 + 200)}`,
            sendingLetterDate: '19 พฤศจิกายน 2569',
            sendingLetterStatus: 'issued',
            workflowStep: 5
          };
        }
        return s;
      })
    );
  };

  // Handler: Register Training
  const handleRegisterTraining = (trainingId: string) => {
    setTrainings(prev =>
      prev.map(t => {
        if (t.id === trainingId) {
          if (t.registeredCount < t.maxSeats) {
            return { ...t, registeredCount: t.registeredCount + 1 };
          } else if (t.reserveCount < t.reserveSeats) {
            return { ...t, reserveCount: t.reserveCount + 1 };
          }
        }
        return t;
      })
    );
  };

  // Handler: Add New Company
  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const newComp: Company = {
      id: `COMP-${Date.now().toString().slice(-4)}`,
      nameTh: newCompanyForm.nameTh,
      nameEn: newCompanyForm.nameEn,
      originalSubmittedNames: [newCompanyForm.nameTh],
      address: newCompanyForm.address,
      phone: newCompanyForm.phone,
      email: newCompanyForm.email,
      contactPerson: newCompanyForm.contactPerson,
      contactPosition: newCompanyForm.contactPosition,
      isVerified: true,
      status: 'active',
      allowedPositions: [newCompanyForm.position]
    };
    setCompanies(prev => [newComp, ...prev]);
    setIsAddCompanyOpen(false);
    setNewCompanyForm({
      nameTh: '',
      nameEn: '',
      address: '',
      phone: '',
      email: '',
      contactPerson: '',
      contactPosition: '',
      position: standardJobPositions[0]
    });
  };

  // Active unmerged companies
  const activeCompanies = companies.filter(c => c.status !== 'merged');

  // Filtered students
  const filteredStudents = students.filter(s => {
    const matchesMajor = selectedMajorFilter === 'all' || s.major.includes(selectedMajorFilter);
    const matchesSearch = s.nameTh.includes(studentSearchQuery) || 
                          s.nameEn.toLowerCase().includes(studentSearchQuery.toLowerCase()) || 
                          s.id.includes(studentSearchQuery);
    return matchesMajor && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Prototype Banner Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                UP
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    ระบบบริหารจัดการการฝึกงานและสหกิจศึกษา คณะ ICT
                  </h2>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    ม.พะเยา (ICT UP)
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  ภาคการศึกษา {settings.semester}/{settings.academicYear} • ช่วงฝึกงานมาตรฐาน {settings.defaultStartDate} ถึง {settings.defaultEndDate}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-start md:self-auto text-xs">
              <button
                onClick={() => setIsMergeModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold border border-purple-200 transition active:scale-95"
              >
                <GitMerge className="w-4 h-4" />
                <span>ยุบรวมชื่อบริษัท (Merge)</span>
              </button>

              <button
                onClick={() => setIsAddCompanyOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-xs transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มสถานประกอบการ</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs based on 5 Steps discussed in audio */}
          <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 pt-1 -mb-px text-xs font-semibold">
            {[
              { id: 'overview', label: '📊 แดชบอร์ดภาพรวม (Group by Company)' },
              { id: 'companies', label: '🏢 ฐานข้อมูลบริษัท & ตรวจชื่อซ้ำ' },
              { id: 'trainings', label: '📅 กิจกรรมอบรม & เช็คชั่วโมง' },
              { id: 'documents', label: '📄 เอกสาร อว. & ตั้งชื่อไฟล์' },
              { id: 'students', label: '👨‍🎓 ข้อมูลนิสิต & สิทธิ์อาจารย์' },
              { id: 'settings', label: '⚙️ ตั้งค่ารอบ & ปลดล็อก' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* ================= TAB 1: OVERVIEW (GROUP BY COMPANY) ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Timeline Stepper (1-5) as พี่จอม requested */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                ลำดับขั้นตอนกระบวนการฝึกงาน (Timeline Workflow 1-5)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                {[
                  { step: '1', title: 'ปลดล็อก & ตั้งค่ารอบ', desc: 'กำหนดวันฝึกงาน 2-19', active: true },
                  { step: '2', title: 'กิจกรรมอบรม', desc: 'จองล่วงหน้า 3 วัน / QR Code', active: true },
                  { step: '3', title: 'ยื่นสถานที่ฝึกงาน', desc: 'ตรวจสอบบริษัท / ตำแหน่งงาน', active: true },
                  { step: '4', title: 'ขอความอนุเคราะห์', desc: 'ออกเลข อว. & ตรวจใบตอบรับ', active: true },
                  { step: '5', title: 'ออกหนังสือส่งตัว', desc: 'เลข อว. ใหม่ & ส่งตัวนิสิต', active: true }
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                      {s.step}
                    </span>
                    <div>
                      <div className="font-bold text-slate-800">{s.title}</div>
                      <div className="text-[11px] text-slate-500">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-medium">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">กรองสาขาวิชา:</span>
                {['all', 'SE', 'CS', 'CG', 'IT'].map(maj => (
                  <button
                    key={maj}
                    onClick={() => setSelectedMajorFilter(maj)}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      selectedMajorFilter === maj
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {maj === 'all' ? 'ทุกสาขา' : maj}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500">
                แสดงผล <strong>{activeCompanies.length}</strong> สถานประกอบการ • นิสิต <strong>{filteredStudents.length}</strong> คน
              </div>
            </div>

            {/* Companies Grouped List (Direct solution to P'Jom's UI problem) */}
            <div className="space-y-4">
              {activeCompanies.map(company => {
                const companyStudents = filteredStudents.filter(s => s.appliedCompanyId === company.id);
                if (companyStudents.length === 0 && selectedMajorFilter !== 'all') return null;

                return (
                  <div key={company.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:border-purple-200 transition">
                    {/* Company Header */}
                    <div className="bg-slate-50/80 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-base">{company.nameTh}</h4>
                            {company.isVerified ? (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                ตรวจสอบแล้ว
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                รอยืนยัน
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            {company.nameEn} • ผู้ประสานงาน: {company.contactPerson} ({company.contactPosition}) • 📞 {company.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-xs font-semibold px-3 py-1 bg-white rounded-lg border border-slate-200 text-slate-700">
                          นิสิตสมัคร: <strong>{companyStudents.length}</strong> คน
                        </span>
                      </div>
                    </div>

                    {/* Students in this company table */}
                    <div className="divide-y divide-slate-100">
                      {companyStudents.length === 0 ? (
                        <div className="p-4 text-xs text-slate-400 italic text-center">
                          ยังไม่มีนิสิตในตัวกรองปัจจุบันที่สมัครบริษัทนี้
                        </div>
                      ) : (
                        companyStudents.map(student => (
                          <div key={student.id} className="p-4 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                            {/* Student Bio */}
                            <div className="flex items-center gap-3 min-w-[280px]">
                              {student.avatarUrl ? (
                                <img
                                  src={student.avatarUrl}
                                  alt={student.nameTh}
                                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                                  {student.nameTh.slice(0, 2)}
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm text-slate-900">{student.nameTh}</span>
                                  <span className="text-xs font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                                    {student.id}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500">
                                  {student.major} • ตำแหน่ง: <strong className="text-slate-700">{student.position || 'ยังไม่ระบุ'}</strong>
                                </div>
                              </div>
                            </div>

                            {/* 3 Status Columns (ขอความอนุเคราะห์ / แบบตอบรับ / หนังสือส่งตัว) */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-xl text-xs">
                              {/* 1. Request Letter */}
                              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                                <span className="text-[11px] text-slate-500 block mb-1">๑. หนังสือขอความอนุเคราะห์</span>
                                {student.requestLetterStatus === 'issued' ? (
                                  <div>
                                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 text-xs">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      {student.requestLetterNumber}
                                    </span>
                                    <button
                                      onClick={() => setSelectedDocPreview({
                                        isOpen: true,
                                        type: 'request',
                                        student,
                                        company
                                      })}
                                      className="text-[11px] text-purple-600 hover:text-purple-800 underline block mt-0.5"
                                    >
                                      พิมพ์/โหลด PDF
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-amber-700 font-medium">รอดำเนินการ</span>
                                )}
                              </div>

                              {/* 2. Acceptance Letter */}
                              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                                <span className="text-[11px] text-slate-500 block mb-1">๒. ใบตอบรับจากบริษัท</span>
                                {student.acceptanceLetterStatus === 'approved_admin' ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 text-xs">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    อนุมัติสมบูรณ์
                                  </span>
                                ) : student.acceptanceLetterStatus === 'verified_advisor' ? (
                                  <div>
                                    <span className="text-indigo-700 font-semibold block">ที่ปรึกษาตรวจแล้ว</span>
                                    <button
                                      onClick={() => handleApproveAcceptance(student.id)}
                                      className="text-[11px] px-2 py-0.5 bg-purple-600 text-white rounded font-medium hover:bg-purple-700 mt-1"
                                    >
                                      พี่จอมอนุมัติ
                                    </button>
                                  </div>
                                ) : student.acceptanceLetterStatus === 'uploaded' ? (
                                  <div>
                                    <span className="text-amber-700 font-semibold block">นิสิตอัปโหลดแล้ว</span>
                                    <button
                                      onClick={() => handleApproveAcceptance(student.id)}
                                      className="text-[11px] px-2 py-0.5 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 mt-1"
                                    >
                                      ที่ปรึกษาตรวจ
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-slate-400">ยังไม่ส่งใบตอบรับ</span>
                                )}
                              </div>

                              {/* 3. Sending Letter */}
                              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                                <span className="text-[11px] text-slate-500 block mb-1">๓. หนังสือส่งตัวนิสิต</span>
                                {student.sendingLetterStatus === 'issued' ? (
                                  <div>
                                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 text-xs">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      {student.sendingLetterNumber}
                                    </span>
                                    <button
                                      onClick={() => setSelectedDocPreview({
                                        isOpen: true,
                                        type: 'sending',
                                        student,
                                        company
                                      })}
                                      className="text-[11px] text-purple-600 hover:text-purple-800 underline block mt-0.5"
                                    >
                                      พิมพ์/โหลด PDF
                                    </button>
                                  </div>
                                ) : student.acceptanceLetterStatus === 'approved_admin' ? (
                                  <button
                                    onClick={() => handleIssueSendingLetter(student.id)}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-[11px] shadow-2xs"
                                  >
                                    ออกหนังสือส่งตัว
                                  </button>
                                ) : (
                                  <span className="text-slate-400">รอใบตอบรับอนุมัติ</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 2: COMPANIES & MERGE ================= */}
        {activeTab === 'companies' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">ฐานข้อมูลสถานประกอบการ (Company Master Data)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  ระบบช่วยตรวจสอบชื่อบริษัทที่นิสิตกรอกซ้ำ สะกดผิด หรือสลับภาษา พร้อมเครื่องมือยุบรวมข้อมูล
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMergeModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition active:scale-95"
                >
                  <GitMerge className="w-4 h-4" />
                  <span>เปิดเครื่องมือยุบรวมชื่อบริษัท</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาชื่อบริษัท (ไทย/อังกฤษ), ที่อยู่, หรือผู้ติดต่อ..."
                value={companySearchQuery}
                onChange={e => setCompanySearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companies.filter(c => 
                c.nameTh.toLowerCase().includes(companySearchQuery.toLowerCase()) ||
                c.nameEn.toLowerCase().includes(companySearchQuery.toLowerCase()) ||
                c.address.toLowerCase().includes(companySearchQuery.toLowerCase())
              ).map(company => {
                const stuCount = students.filter(s => s.appliedCompanyId === company.id).length;
                return (
                  <div
                    key={company.id}
                    className={`bg-white rounded-2xl p-5 border transition relative ${
                      company.status === 'merged'
                        ? 'opacity-60 bg-slate-50 border-dashed border-slate-300'
                        : company.status === 'pending_review'
                        ? 'border-amber-300 bg-amber-50/20 shadow-xs'
                        : 'border-slate-200 shadow-2xs hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{company.nameTh}</h4>
                        <p className="text-xs text-slate-500">{company.nameEn}</p>
                      </div>

                      {company.status === 'merged' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                          ยุบรวมแล้ว
                        </span>
                      ) : company.status === 'pending_review' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          รอแอดมินตรวจ
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          ข้อมูลหลัก
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 my-3">
                      <p>📍 {company.address}</p>
                      <p>📞 {company.phone} • ✉️ {company.email}</p>
                      <p>👤 ผู้ประสานงาน: {company.contactPerson} ({company.contactPosition})</p>
                    </div>

                    {/* Original Submitted Names history */}
                    {company.originalSubmittedNames && company.originalSubmittedNames.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[11px] text-slate-400 block mb-1">
                          ชื่อที่นิสิตเคยกรอกเข้ามา:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {company.originalSubmittedNames.map((alias, aIdx) => (
                            <span key={aIdx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              "{alias}"
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                      <span className="font-medium text-slate-500">
                        นิสิตที่สมัคร: <strong className="text-purple-700">{stuCount}</strong> คน
                      </span>
                      {company.status === 'pending_review' && (
                        <button
                          onClick={() => setIsMergeModalOpen(true)}
                          className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
                        >
                          <GitMerge className="w-3.5 h-3.5" />
                          ยุบรวมเข้าบริษัทหลัก
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: TRAININGS & QR CODE ================= */}
        {activeTab === 'trainings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">กิจกรรมอบรมเตรียมความพร้อม (Training & Hours)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  ระบบเปิดลงทะเบียนก่อนกิจกรรม 3 วัน (First-come First-served) • มีที่นั่งจริงและที่นั่งสำรอง • สแกน QR Code เช็คอิน
                </p>
              </div>

              <div className="text-xs text-slate-600 bg-purple-50 px-3.5 py-2 rounded-xl border border-purple-100">
                ⭐ เกณฑ์ชั่วโมงกิจกรรม: <strong>ผ่านขั้นต่ำ 12 ชั่วโมง</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trainings.map(trn => {
                const isFull = trn.registeredCount >= trn.maxSeats;
                return (
                  <div key={trn.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {trn.hours} ชั่วโมงกิจกรรม
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          trn.status === 'open' ? 'bg-emerald-100 text-emerald-800' :
                          trn.status === 'closed' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {trn.status === 'open' ? 'กำลังเปิดรับ' : trn.status === 'closed' ? 'ที่นั่งเต็มแล้ว' : 'เร็วๆ นี้'}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm leading-snug mb-2">{trn.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-3 mb-4">{trn.description}</p>
                      
                      <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700 mb-4 border border-slate-100">
                        <div>📅 วันที่: <strong>{trn.date}</strong></div>
                        <div>⏰ เวลา: <strong>{trn.startTime} - {trn.endTime} น.</strong></div>
                        <div className="pt-1.5 border-t border-slate-200 flex justify-between">
                          <span>ที่นั่งจริง: <strong>{trn.registeredCount}/{trn.maxSeats}</strong></span>
                          <span>ที่นั่งสำรอง: <strong>{trn.reserveCount}/{trn.reserveSeats}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedTrainingModal(trn)}
                        className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition active:scale-95 text-center flex items-center justify-center gap-1.5"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>ลงทะเบียน / QR เช็คอิน</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 4: OFFICIAL DOCUMENTS ================= */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-lg font-bold text-slate-900">ระบบเอกสารราชการ อว. และการตั้งชื่อไฟล์อัตโนมัติ</h3>
              <p className="text-xs text-slate-500 mt-1">
                เอกสารตราครุฑทางการ จัดรูปแบบบรรทัดตามระเบียบสารบรรณ และตั้งชื่อไฟล์เพื่อส่งสถานประกอบการตามกฎที่ตกลงไว้
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
              <h4 className="font-bold text-indigo-950 text-sm mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-700" />
                กฎการตั้งชื่อไฟล์อัตโนมัติเมื่อดาวน์โหลด (Automatic File Naming Rule)
              </h4>
              <p className="text-xs text-indigo-900 leading-relaxed mb-4">
                จากข้อเสนอแนะของพี่จอมในไฟล์เสียง (นาทีที่ 35:24) ป้องกันนิสิตส่งไฟล์ที่มีแค่เลข อว. จนบริษัทสับสน ระบบจะ Generate ชื่อไฟล์อัตโนมัติในรูปแบบ:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-white p-3 rounded-xl border border-indigo-200">
                  <span className="text-[11px] text-slate-400 block font-sans">๑. หนังสือขอความอนุเคราะห์:</span>
                  <span className="text-purple-700 font-bold">
                    ขอความอนุเคราะห์รับนิสิตฝึกงาน มหาวิทยาลัยพะเยา (ชื่อบริษัท).pdf
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-200">
                  <span className="text-[11px] text-slate-400 block font-sans">๒. หนังสือส่งตัวนิสิต:</span>
                  <span className="text-emerald-700 font-bold">
                    หนังสือส่งตัวนิสิตฝึกงาน มหาวิทยาลัยพะเยา (ชื่อบริษัท).pdf
                  </span>
                </div>
              </div>
            </div>

            {/* List of generated documents for students */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-xs text-slate-700">
                รายการเอกสารราชการประจำรอบการฝึกงาน
              </div>
              <div className="divide-y divide-slate-100">
                {students.filter(s => s.status !== 'dropped').map(s => {
                  const company = companies.find(c => c.id === s.appliedCompanyId);
                  return (
                    <div key={s.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{s.nameTh}</span>
                          <span className="text-xs font-mono text-purple-700">({s.id})</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {s.major} • บริษัท: <strong className="text-slate-800">{company?.nameTh || 'ยังไม่ระบุ'}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDocPreview({
                            isOpen: true,
                            type: 'request',
                            student: s,
                            company
                          })}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200 transition"
                        >
                          เปิดตัวอย่างหนังสือขอความอนุเคราะห์
                        </button>

                        {s.sendingLetterStatus === 'issued' && (
                          <button
                            onClick={() => setSelectedDocPreview({
                              isOpen: true,
                              type: 'sending',
                              student: s,
                              company
                            })}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition"
                          >
                            เปิดตัวอย่างหนังสือส่งตัว
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: STUDENTS & PRIVACY (PDPA) ================= */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">ทะเบียนข้อมูลนิสิต & การจัดการสิทธิ์ (Students & Advisors)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  ปรับปรุงตามหลัก PDPA ตัดข้อมูล Social Media ส่วนบุคคลออก • แสดงอาจารย์ที่ปรึกษา vs อาจารย์นิเทศก์แยกพื้นที่
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหารหัสนิสิต หรือชื่อ-สกุล..."
                  value={studentSearchQuery}
                  onChange={e => setStudentSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map(student => {
                const advisor = mockAdvisors.find(a => a.id === student.advisorId);
                const visitingAdvisor = mockAdvisors.find(a => a.id === student.visitingAdvisorId);
                const company = companies.find(c => c.id === student.appliedCompanyId);

                return (
                  <div
                    key={student.id}
                    className={`bg-white rounded-2xl p-5 border transition ${
                      student.status === 'dropped'
                        ? 'opacity-65 bg-slate-50 border-rose-200'
                        : 'border-slate-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {student.avatarUrl ? (
                          <img
                            src={student.avatarUrl}
                            alt={student.nameTh}
                            className="w-12 h-12 rounded-full object-cover border-2 border-purple-100 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {student.nameTh.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{student.nameTh}</h4>
                            <span className="text-xs font-mono text-purple-700 font-semibold bg-purple-50 px-1.5 py-0.2 rounded">
                              {student.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{student.nameEn}</p>
                          <p className="text-[11px] text-slate-400">{student.major}</p>
                        </div>
                      </div>

                      {student.status === 'dropped' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                          ดรอป/พักการฝึกงาน
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          สถานะปกติ
                        </span>
                      )}
                    </div>

                    {/* PDPA: Privacy-Friendly Contact Details (No Line/Facebook) */}
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600 my-3 border border-slate-100">
                      <div>📞 โทรศัพท์: <strong>{student.phone}</strong></div>
                      <div>✉️ อีเมลสถาบัน: <strong>{student.email}</strong></div>
                      <div>🏢 สถานที่ฝึกงาน: <strong>{company?.nameTh || 'ยังไม่ระบุ'}</strong> (ตำแหน่ง: {student.position || '-'})</div>
                    </div>

                    {/* Advisor & Visiting Advisor distinction */}
                    <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">อาจารย์ที่ปรึกษา:</span>
                        <span className="font-semibold text-slate-800">{advisor?.name || '-'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">อาจารย์นิเทศก์ (ตามโซน):</span>
                        <span className="font-semibold text-indigo-700">
                          {visitingAdvisor?.name || 'รอจัดสายเดินทาง'} ({visitingAdvisor?.visitingRegion || 'สาขากำลังประชุม'})
                        </span>
                      </div>
                    </div>

                    {/* Drop student action (All advisors can trigger as discussed) */}
                    {student.status !== 'dropped' && (
                      <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => setDropStudentModal({ isOpen: true, student })}
                          className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>ดรอป/พักการฝึกงานนิสิต</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 6: SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">ตั้งค่ารอบการฝึกงานและหนังสือ อว.</h3>
              <p className="text-xs text-slate-500 mt-1">
                กำหนดค่า Default ประจำรอบการศึกษา และอนุญาตให้แอดมินแก้ไขเป็นรายกรณี
              </p>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 font-bold">ปีการศึกษา</label>
                  <input
                    type="text"
                    value={settings.academicYear}
                    onChange={e => setSettings({ ...settings, academicYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 font-bold">ภาคเรียน</label>
                  <input
                    type="text"
                    value={settings.semester}
                    onChange={e => setSettings({ ...settings, semester: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 font-bold">วันเริ่มต้นฝึกงาน (Default)</label>
                  <input
                    type="date"
                    value={settings.defaultStartDate}
                    onChange={e => setSettings({ ...settings, defaultStartDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 font-bold">วันสิ้นสุดฝึกงาน (Default)</label>
                  <input
                    type="date"
                    value={settings.defaultEndDate}
                    onChange={e => setSettings({ ...settings, defaultEndDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 font-bold">เลข อว. หนังสือขอความอนุเคราะห์ (Prefix)</label>
                <input
                  type="text"
                  value={settings.requestLetterPrefix}
                  onChange={e => setSettings({ ...settings, requestLetterPrefix: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold">ชื่อคณบดีผู้มีอำนาจลงนาม</label>
                <input
                  type="text"
                  value={settings.deanName}
                  onChange={e => setSettings({ ...settings, deanName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => alert('บันทึกการตั้งค่าเรียบร้อยแล้ว')}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition active:scale-95"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      <CompanyMergeModal
        isOpen={isMergeModalOpen}
        onClose={() => setIsMergeModalOpen(false)}
        companies={companies}
        students={students}
        onMerge={handleMergeCompanies}
      />

      {selectedDocPreview.student && (
        <DocumentPreviewModal
          isOpen={selectedDocPreview.isOpen}
          onClose={() => setSelectedDocPreview({ isOpen: false, type: 'request', student: null })}
          type={selectedDocPreview.type}
          student={selectedDocPreview.student}
          company={selectedDocPreview.company}
        />
      )}

      {selectedTrainingModal && (
        <TrainingRegistrationModal
          isOpen={!!selectedTrainingModal}
          onClose={() => setSelectedTrainingModal(null)}
          training={selectedTrainingModal}
          students={students}
          onRegister={handleRegisterTraining}
        />
      )}

      {/* Drop Student Modal */}
      {dropStudentModal.isOpen && dropStudentModal.student && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-base">ยืนยันการดรอป/พักการฝึกงาน</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              ท่านต้องการเปลี่ยนสถานะของ <strong>{dropStudentModal.student.nameTh} ({dropStudentModal.student.id})</strong> เป็น "ดรอป/พักการฝึกงาน" ใช่หรือไม่? (สิทธิ์ของอาจารย์ทุกคนตามข้อตกลง)
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDropStudentModal({ isOpen: false, student: null })}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleConfirmDropStudent(dropStudentModal.student!.id)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition"
              >
                ยืนยันการดรอปนิสิต
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Company Modal with Standard Job Position Dropdown */}
      {isAddCompanyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h4 className="font-bold text-slate-900 text-base mb-1">เพิ่มสถานประกอบการใหม่</h4>
            <p className="text-xs text-slate-500 mb-4">
              กรอกข้อมูลสถานประกอบการและเลือกตำแหน่งงานตามมาตรฐาน
            </p>

            <form onSubmit={handleCreateCompany} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อสถานประกอบการ (ภาษาไทย) *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น บริษัท อินโนเวทีฟ แล็บ จำกัด"
                  value={newCompanyForm.nameTh}
                  onChange={e => setNewCompanyForm({ ...newCompanyForm, nameTh: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อภาษาอังกฤษ (English Name)</label>
                <input
                  type="text"
                  placeholder="เช่น Innovative Lab Co., Ltd."
                  value={newCompanyForm.nameEn}
                  onChange={e => setNewCompanyForm({ ...newCompanyForm, nameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ที่อยู่สถานประกอบการ</label>
                <input
                  type="text"
                  placeholder="เลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด"
                  value={newCompanyForm.address}
                  onChange={e => setNewCompanyForm({ ...newCompanyForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    placeholder="02-xxx-xxxx"
                    value={newCompanyForm.phone}
                    onChange={e => setNewCompanyForm({ ...newCompanyForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">อีเมลติดต่อ</label>
                  <input
                    type="email"
                    placeholder="hr@company.com"
                    value={newCompanyForm.email}
                    onChange={e => setNewCompanyForm({ ...newCompanyForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อผู้ประสานงาน / HR</label>
                  <input
                    type="text"
                    placeholder="ชื่อ-นามสกุล"
                    value={newCompanyForm.contactPerson}
                    onChange={e => setNewCompanyForm({ ...newCompanyForm, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ตำแหน่งผู้ประสานงาน</label>
                  <input
                    type="text"
                    placeholder="เช่น ผู้จัดการฝ่าย HR"
                    value={newCompanyForm.contactPosition}
                    onChange={e => setNewCompanyForm({ ...newCompanyForm, contactPosition: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Standard Job Position Dropdown (From meeting requirement) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ตำแหน่งงานมาตรฐาน (Standardized Job Position) *
                </label>
                <select
                  value={newCompanyForm.position}
                  onChange={e => setNewCompanyForm({ ...newCompanyForm, position: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {standardJobPositions.map((pos, pIdx) => (
                    <option key={pIdx} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCompanyOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-xs"
                >
                  บันทึกสถานประกอบการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
