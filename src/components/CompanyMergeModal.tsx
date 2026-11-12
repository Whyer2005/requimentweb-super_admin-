import React, { useState } from 'react';
import { X, GitMerge, Check, AlertTriangle, Building2, Users } from 'lucide-react';
import { Company, Student } from '../types';

interface CompanyMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  students: Student[];
  onMerge: (masterCompanyId: string, mergedCompanyIds: string[]) => void;
}

export const CompanyMergeModal: React.FC<CompanyMergeModalProps> = ({
  isOpen,
  onClose,
  companies,
  students,
  onMerge
}) => {
  const [masterId, setMasterId] = useState<string>('');
  const [selectedDuplicates, setSelectedDuplicates] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Active verified companies suitable as master
  const verifiedCompanies = companies.filter(c => c.status === 'active');
  // Pending or possible duplicate companies
  const candidateCompanies = companies.filter(c => c.id !== masterId);

  const toggleDuplicate = (id: string) => {
    setSelectedDuplicates(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePerformMerge = () => {
    if (!masterId || selectedDuplicates.length === 0) return;
    onMerge(masterId, selectedDuplicates);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  const masterCompany = companies.find(c => c.id === masterId);
  const affectedStudents = students.filter(s => s.appliedCompanyId && selectedDuplicates.includes(s.appliedCompanyId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                ระบบยุบรวมชื่อบริษัท (Company Merge Tool)
              </h3>
              <p className="text-xs text-slate-500">
                แก้ไขปัญหานิสิตพิมพ์ชื่อบริษัทซ้ำ หรือสะกดผิดให้รวมเข้ากับบริษัทหลักในฐานข้อมูล
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-800">ยุบรวมข้อมูลบริษัทสำเร็จ!</h4>
            <p className="text-sm text-slate-500">
              ย้ายข้อมูลนิสิตทั้งหมดที่เกี่ยวข้องเข้าสู่ "{masterCompany?.nameTh}" เรียบร้อยแล้ว
            </p>
          </div>
        ) : (
          <div className="py-4 space-y-6">
            {/* Step 1: Select Master Company */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. เลือกบริษัทหลักในฐานข้อมูล (Master Company)
              </label>
              <select
                value={masterId}
                onChange={e => {
                  setMasterId(e.target.value);
                  setSelectedDuplicates(prev => prev.filter(id => id !== e.target.value));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
              >
                <option value="">-- กรุณาเลือกบริษัทหลักที่มีข้อมูลถูกต้อง --</option>
                {verifiedCompanies.map(comp => (
                  <option key={comp.id} value={comp.id}>
                    {comp.nameTh} ({comp.nameEn})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Duplicate entries to merge */}
            {masterId && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. เลือกชื่อบริษัทที่นิสิตกรอกซ้ำ ที่ต้องการยุบรวมเข้าสู่บริษัทหลัก
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {candidateCompanies.map(comp => {
                    const isChecked = selectedDuplicates.includes(comp.id);
                    const stuCount = students.filter(s => s.appliedCompanyId === comp.id).length;
                    return (
                      <div
                        key={comp.id}
                        onClick={() => toggleDuplicate(comp.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition select-none ${
                          isChecked
                            ? 'bg-purple-50 border-purple-300 text-purple-900'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by parent div
                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 pointer-events-none"
                          />
                          <div>
                            <div className="text-sm font-semibold">{comp.nameTh}</div>
                            <div className="text-xs text-slate-500">{comp.nameEn} • {comp.address}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {comp.status === 'pending_review' && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              รอตรวจ
                            </span>
                          )}
                          <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-100 text-slate-600 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {stuCount} คน
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Summary of Impact */}
            {masterId && selectedDuplicates.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  สรุปผลกระทบที่จะเกิดขึ้นเมื่อกดยุบรวม:
                </div>
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>
                    บริษัทที่ถูกเลือกจำนวน <strong>{selectedDuplicates.length} รายการ</strong> จะถูกตั้งสถานะเป็น <em>merged</em>
                  </li>
                  <li>
                    นิสิตที่สมัครในรายการที่ซ้ำจำนวน <strong>{affectedStudents.length} คน</strong> จะถูกอัปเดตสังกัดมาที่ <strong>"{masterCompany?.nameTh}"</strong> อัตโนมัติ
                  </li>
                  <li>
                    ระบบจะบันทึกประวัติการส่งซ้ำไว้ใน <code>originalSubmittedNames</code> สำหรับช่วยระบบ Autocomplete ในอนาคต
                  </li>
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={!masterId || selectedDuplicates.length === 0}
                onClick={handlePerformMerge}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-medium text-sm shadow-sm transition active:scale-95"
              >
                ยืนยันการยุบรวมข้อมูล ({selectedDuplicates.length} รายการ)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
