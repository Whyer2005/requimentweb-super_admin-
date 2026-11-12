import React, { useState } from 'react';
import { 
  FileText, Headphones, Sparkles, CheckCircle2, Building2, 
  BookOpen, ExternalLink, GraduationCap, ChevronRight, Share2 
} from 'lucide-react';
import { AudioPlayerSection } from './components/AudioPlayerSection';
import { RequirementsSummary } from './components/RequirementsSummary';
import { WorkflowPrototype } from './components/WorkflowPrototype';

export default function App() {
  const [activeMainView, setActiveMainView] = useState<'transcription' | 'prototype'>('transcription');
  const [seekSeconds, setSeekSeconds] = useState<number | null>(null);

  const handlePlayTimestamp = (seconds: number) => {
    setActiveMainView('transcription');
    setSeekSeconds(seconds);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/95 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-800 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                ICT
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900">
                    ระบบถอดข้อมูลเสียง &amp; บริหารจัดการสหกิจศึกษา
                  </h1>
                  <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    ม.พะเยา (UP)
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  ถอดข้อมูลการประชุม 70:47 นาที พร้อมตัวอย่างระบบตามข้อกำหนด
                </p>
              </div>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveMainView('transcription')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                  activeMainView === 'transcription'
                    ? 'bg-white text-purple-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 text-purple-600" />
                <span>ผลถอดเสียง &amp; ข้อกำหนด (SRS)</span>
              </button>

              <button
                onClick={() => setActiveMainView('prototype')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                  activeMainView === 'prototype'
                    ? 'bg-white text-purple-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>ระบบจำลองตาม Requirement</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeMainView === 'transcription' ? (
          <div className="space-y-6">
            {/* Audio Player Component */}
            <AudioPlayerSection
              currentSeekTime={seekSeconds}
              onSeekHandled={() => setSeekSeconds(null)}
            />

            {/* Requirements & Action Items Component */}
            <RequirementsSummary onPlayTimestamp={handlePlayTimestamp} />
          </div>
        ) : (
          /* Interactive Prototype View */
          <div>
            <WorkflowPrototype />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            ระบบถอดข้อมูลและวิเคราะห์ความต้องการสำหรับระบบบริหารจัดการการฝึกงานและสหกิจศึกษา
          </p>
          <p className="mt-1 text-slate-400">
            คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา (School of Information and Communication Technology, University of Phayao)
          </p>
        </div>
      </footer>
    </div>
  );
}
