import React, { useState } from 'react';
import { X, Download, Printer, CheckCircle, FileText, Building2, Calendar, ShieldCheck } from 'lucide-react';
import { Student, Company } from '../types';
import { systemSettingsDefault } from '../data/mockInternshipData';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'request' | 'sending';
  student: Student;
  company?: Company;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  type,
  student,
  company
}) => {
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (!isOpen) return null;

  const docTypeLabel = type === 'request' ? 'หนังสือขอความอนุเคราะห์รับนิสิตฝึกงาน' : 'หนังสือส่งตัวนิสิตฝึกงาน';
  const docNumber = type === 'request' 
    ? (student.requestLetterNumber || `${systemSettingsDefault.requestLetterPrefix}0142`)
    : (student.sendingLetterNumber || `${systemSettingsDefault.sendingLetterPrefix}0289`);
  
  const docDate = type === 'request'
    ? (student.requestLetterDate || '11 พฤศจิกายน 2569')
    : (student.sendingLetterDate || '18 พฤศจิกายน 2569');

  // Exact file naming requirement agreed upon in the audio recording!
  const targetCompanyName = company?.nameTh || 'สถานประกอบการ';
  const autoFileName = type === 'request'
    ? `ขอความอนุเคราะห์รับนิสิตฝึกงาน มหาวิทยาลัยพะเยา (${targetCompanyName}).pdf`
    : `หนังสือส่งตัวนิสิตฝึกงาน มหาวิทยาลัยพะเยา (${targetCompanyName}).pdf`;

  const handleDownload = () => {
    setIsDownloaded(true);
    // Simulate downloading with the correct file name
    const element = document.createElement('a');
    const file = new Blob([
      `เอกสารทางการ: ${docTypeLabel}\nเลขที่: ${docNumber}\nมหาวิทยาลัยพะเยา\nเรียน: ${targetCompanyName}\nนิสิต: ${student.nameTh} (${student.id})`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = autoFileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                {type === 'request' ? 'แบบ อว. 01' : 'แบบ อว. 02'}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                ตัวอย่างเอกสารราชการ: {docTypeLabel}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              จัดรูปแบบเว้นวรรค ย่อหน้า และฟิกซ์บรรทัดตามระเบียบสารบรรณ และตั้งชื่อไฟล์ตามกฎอัตโนมัติ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs shadow-sm transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลด PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Naming Rule Banner (from the audio meeting) */}
        <div className="my-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-indigo-900 font-medium">
            <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>ชื่อไฟล์ดาวน์โหลดอัตโนมัติ (File Naming Rule):</strong>{' '}
              <code className="bg-white px-2 py-0.5 rounded text-purple-700 font-mono font-semibold border border-indigo-100">
                {autoFileName}
              </code>
            </span>
          </div>
          {isDownloaded && (
            <span className="text-emerald-700 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle className="w-4 h-4" /> ดาวน์โหลดเรียบร้อย
            </span>
          )}
        </div>

        {/* Official Document Preview Sheet (Strict Thai Government Style) */}
        <div className="flex-1 bg-slate-100 p-4 sm:p-8 rounded-xl overflow-y-auto">
          <div 
            className="bg-white max-w-[210mm] mx-auto p-10 sm:p-14 shadow-md rounded-sm border border-slate-300 text-slate-900 font-serif leading-relaxed text-sm select-text"
            style={{ fontFamily: "'Sarabun', 'TH Sarabun New', serif" }}
          >
            {/* Garuda Emblem */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto bg-amber-50 rounded-full flex items-center justify-center border border-amber-200/80 mb-2 shadow-xs">
                {/* SVG Garuda emblem placeholder */}
                <svg viewBox="0 0 100 100" className="w-16 h-16 text-amber-700 fill-current">
                  <path d="M50 10 C45 25 30 35 20 40 C35 45 40 60 50 85 C60 60 65 45 80 40 C70 35 55 25 50 10 Z" opacity="0.85"/>
                  <circle cx="50" cy="30" r="10" opacity="0.9"/>
                </svg>
              </div>
              <p className="text-xs text-slate-400 font-sans">ตราครุฑ (หนังสือราชการ คณะ ICT มหาวิทยาลัยพะเยา)</p>
            </div>

            {/* Document Header */}
            <div className="flex justify-between items-start mb-6 text-sm">
              <div>
                <p>ที่ {docNumber}</p>
              </div>
              <div className="text-right">
                <p>คณะเทคโนโลยีสารสนเทศและการสื่อสาร</p>
                <p>มหาวิทยาลัยพะเยา ๑๙ หมู่ ๒</p>
                <p>ตำบลแม่กา อำเภอเมือง จังหวัดพะเยา ๕๖๐๐๐</p>
              </div>
            </div>

            <div className="text-center my-6">
              <p>{docDate}</p>
            </div>

            {/* Subject and Recipient */}
            <div className="space-y-2 mb-6">
              <p>
                <strong>เรื่อง</strong>&nbsp;&nbsp;&nbsp;&nbsp;{docTypeLabel}
              </p>
              <p>
                <strong>เรียน</strong>&nbsp;&nbsp;&nbsp;&nbsp;{company?.contactPosition || 'ผู้จัดการฝ่ายทรัพยากรบุคคล'} {targetCompanyName}
              </p>
              <p>
                <strong>สิ่งที่ส่งมาด้วย</strong>&nbsp;&nbsp;&nbsp;&nbsp;๑. แบบตอบรับการฝึกงานของนิสิต&nbsp;&nbsp;&nbsp;&nbsp;จำนวน ๑ ฉบับ
              </p>
            </div>

            {/* Body Paragraph 1 (with strict indentation and non-breaking spaces) */}
            <div className="text-justify mb-5 indent-12 leading-loose">
              ด้วยคณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา ได้จัดการเรียนการสอนหลักสูตร{student.curriculum} ซึ่งมีข้อกำหนดให้นิสิตในระดับปริญญาตรีต้องเข้ารับการฝึกประสบการณ์วิชาชีพหรือสหกิจศึกษา ณ สถานประกอบการ เพื่อเป็นการเสริมสร้างทักษะ ประสบการณ์ตรง และเตรียมความพร้อมในการปฏิบัติงานจริงก่อนสำเร็จการศึกษา
            </div>

            {/* Body Paragraph 2 */}
            <div className="text-justify mb-5 indent-12 leading-loose">
              ในการนี้ คณะฯ พิจารณาเห็นว่าหน่วยงานของท่านเป็นสถานประกอบการที่มีความเชี่ยวชาญ มีมาตรฐานการดำเนินงานระดับสูง และมีความพร้อมในการถ่ายทอดประสบการณ์วิชาชีพให้แก่นิสิตเป็นอย่างดียิ่ง จึงใคร่ขอความอนุเคราะห์รับนิสิตเข้ารับการฝึกประสบการณ์วิชาชีพ ในตำแหน่ง <strong>"{student.position || 'Full Stack Developer'}"</strong> ระหว่างวันที่ <strong>๒ ธันวาคม ๒๕๖๙ ถึงวันที่ ๑๙ มีนาคม ๒๕๗๐</strong> จำนวน ๑ ราย ดังนี้
            </div>

            {/* Student List Box */}
            <div className="my-4 ml-12 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <p><strong>๑. {student.nameTh}</strong> ({student.nameEn})</p>
              <p className="text-xs text-slate-600">รหัสประจำตัวนิสิต: {student.id}&nbsp;&nbsp;&nbsp;&nbsp;สาขาวิชา: {student.major}</p>
              <p className="text-xs text-slate-600">โทรศัพท์: {student.phone}&nbsp;&nbsp;&nbsp;&nbsp;อีเมล: {student.email}</p>
            </div>

            {/* Closing */}
            <div className="text-justify mb-10 indent-12 leading-loose">
              จึงเรียนมาเพื่อโปรดพิจารณาให้ความอนุเคราะห์ และขอขอบพระคุณในความร่วมมือทางวิชาการร่วมกับมหาวิทยาลัยพะเยา มา ณ โอกาสนี้
            </div>

            {/* Signature Block */}
            <div className="text-right pr-12 space-y-2 mt-8">
              <p>ขอแสดงความนับถือ</p>
              <div className="h-12 flex items-center justify-end">
                {/* Simulated Digital Signature */}
                <span className="font-serif italic text-purple-900 border-b border-purple-400 px-6 py-1 text-base">
                  (ลายเซ็นดิจิทัลคณบดี)
                </span>
              </div>
              <p className="font-bold">({systemSettingsDefault.deanName})</p>
              <p className="text-xs text-slate-600">{systemSettingsDefault.deanTitle}</p>
            </div>

            {/* Footer Coordinator Info */}
            <div className="mt-14 pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-0.5">
              <p>งานบริการการศึกษาและสหกิจศึกษา (พี่จอม)</p>
              <p>โทรศัพท์ ๐ ๕๔๔๖ ๖๖๖๖ ต่อ ๓๑๒๙</p>
              <p>อีเมล ict.coop@up.ac.th</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-4">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            ระบบตรวจสอบการตัดคำภาษาไทยและจัดหน้ากระดาษตามมาตรฐานระเบียบสารบรรณแล้ว
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
