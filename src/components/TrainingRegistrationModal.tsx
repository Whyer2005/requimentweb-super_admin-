import React, { useState } from 'react';
import { X, QrCode, Clock, CheckCircle2, UserCheck, Calendar, Users, AlertCircle } from 'lucide-react';
import { TrainingActivity, Student } from '../types';

interface TrainingRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: TrainingActivity | null;
  students: Student[];
  onRegister: (trainingId: string, studentId: string) => void;
}

export const TrainingRegistrationModal: React.FC<TrainingRegistrationModalProps> = ({
  isOpen,
  onClose,
  training,
  students,
  onRegister
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkInMode, setCheckInMode] = useState<'register' | 'qrcode'>('register');
  const [qrScanned, setQrScanned] = useState(false);

  if (!isOpen || !training) return null;

  const isFull = training.registeredCount >= training.maxSeats;
  const isReserveFull = training.reserveCount >= training.reserveSeats;
  const isAllFull = isFull && isReserveFull;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    onRegister(training.id, selectedStudentId);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setCheckInMode('qrcode');
    }, 1200);
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {checkInMode === 'register' ? 'ลงทะเบียนเข้าร่วมกิจกรรมอบรม' : 'QR Code เช็คอินเข้า-ออกหน้างาน'}
              </h3>
              <p className="text-xs text-slate-500">
                ระบบเปิดรับก่อน 3 วัน • First-come First-served (บันทึก Timestamp)
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

        {/* Tab switch between Register and QR Code Mode */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl my-4 text-xs font-semibold">
          <button
            onClick={() => setCheckInMode('register')}
            className={`flex-1 py-2 rounded-lg transition ${
              checkInMode === 'register' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            จองที่นั่งล่วงหน้า ({training.registeredCount}/{training.maxSeats})
          </button>
          <button
            onClick={() => setCheckInMode('qrcode')}
            className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              checkInMode === 'qrcode' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            สแกน QR Code หน้างาน
          </button>
        </div>

        {checkInMode === 'register' ? (
          <div>
            {/* Training Details Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 text-sm">{training.title}</h4>
              <p className="text-slate-600">{training.description}</p>
              
              <div className="grid grid-cols-2 gap-2 pt-2 text-slate-700 border-t border-slate-200">
                <div>📅 วันที่: <strong>{training.date}</strong></div>
                <div>⏰ เวลา: <strong>{training.startTime} - {training.endTime} น.</strong> ({training.hours} ชั่วโมง)</div>
              </div>

              {/* Seats breakdown (from discussion: 60 regular + 10 reserve) */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-purple-100 mt-2">
                <div>
                  <span className="text-slate-500 block">ที่นั่งจริง (Main Seats):</span>
                  <span className="font-bold text-slate-900">{training.registeredCount} / {training.maxSeats} ที่นั่ง</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">ที่นั่งสำรอง (Reserve Seats):</span>
                  <span className="font-bold text-purple-700">{training.reserveCount} / {training.reserveSeats} ที่นั่ง</span>
                </div>
              </div>
            </div>

            {isSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-slate-800 text-base">ลงทะเบียนสำเร็จ!</h5>
                <p className="text-xs text-slate-500">
                  ระบบได้บันทึก Timestamp: {new Date().toLocaleTimeString('th-TH')} น.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    เลือกนิสิตที่จะลงทะเบียน (First-come First-served)
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                    required
                  >
                    <option value="">-- เลือกรหัสนิสิตและชื่อ-สกุล --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.id} - {s.nameTh} ({s.major})
                      </option>
                    ))}
                  </select>
                </div>

                {isFull && !isReserveFull && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>ที่นั่งจริงเต็มแล้ว ท่านจะได้รับสิทธิ์ใน <strong>ลำดับที่นั่งสำรองที่ {training.reserveCount + 1}</strong></span>
                  </div>
                )}

                {isAllFull && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>กิจกรรมนี้มีผู้ลงทะเบียนครบทั้งที่นั่งจริงและที่นั่งสำรองแล้ว</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isAllFull || !selectedStudentId}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-medium shadow-sm transition active:scale-95"
                  >
                    ยืนยันการลงทะเบียน (จองที่นั่ง)
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* QR Code Check-in View */
          <div className="py-4 text-center space-y-4">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
              {/* Simulated QR Code box */}
              <div className="w-44 h-44 bg-white p-3 rounded-xl border-2 border-dashed border-purple-400 mx-auto flex flex-col items-center justify-center relative overflow-hidden">
                <QrCode className="w-32 h-32 text-slate-800" />
                <span className="text-[10px] font-mono text-purple-700 mt-1 font-semibold">
                  TRN-{training.id}-CHECKIN
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600 max-w-sm mx-auto">
              <p className="font-bold text-slate-800 text-sm">สแกน QR Code เพื่อเช็คอินเข้า-ออก</p>
              <p>ระบบตรวจสอบตำแหน่งและบันทึกเวลาเข้าร่วมอบรม 3 ชั่วโมงอัตโนมัติ</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setQrScanned(!qrScanned)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                  qrScanned
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {qrScanned ? '✓ จำลอง: นิสิตสแกนเช็คอินสำเร็จแล้ว' : 'กดเพื่อจำลองการสแกนเช็คอิน'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
