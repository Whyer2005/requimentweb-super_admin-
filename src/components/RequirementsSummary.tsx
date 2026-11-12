import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, Clock, Play, Copy, Check, Filter, 
  AlertCircle, Building2, UserCheck, Calendar, BookOpen, Layers, Sparkles
} from 'lucide-react';
import { systemRequirements, actionItemsList } from '../data/transcriptionData';

interface RequirementsSummaryProps {
  onPlayTimestamp: (seconds: number) => void;
}

export const RequirementsSummary: React.FC<RequirementsSummaryProps> = ({ onPlayTimestamp }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [actionItems, setActionItems] = useState(actionItemsList);

  const categories = [
    { id: 'all', label: 'ทั้งหมด (10 หมวด)' },
    { id: 'การเชื่อมต่อและการส่งออกข้อมูล', label: '📊 Google Sheets/Excel' },
    { id: 'การกำหนดสิทธิ์และบทบาท', label: '👨‍🏫 อาจารย์นิเทศก์ & สิทธิ์' },
    { id: 'รอบการฝึกงานและหนังสือราชการ', label: '⚙️ รอบฝึกงาน & วันที่' },
    { id: 'การจัดรูปแบบเอกสารราชการ', label: '📑 จัดหน้ากระดาษ อว.' },
    { id: 'กิจกรรมและการเช็คชั่วโมง', label: '📅 อบรม & QR เช็คอิน' },
    { id: 'ฐานข้อมูลสถานประกอบการ', label: '🏢 บริษัทซ้ำ & Merge' },
    { id: 'มาตรฐานตำแหน่งงาน', label: '💼 ตำแหน่งงานมาตรฐาน' },
    { id: 'เอกสารขอความอนุเคราะห์และส่งตัว', label: '📥 เอกสาร 3 ขั้นตอน' },
    { id: 'การจัดการข้อมูลส่วนบุคคล (PDPA)', label: '🔒 ข้อมูลนิสิต (PDPA)' },
    { id: 'การปรับปรุง UI/UX', label: '🎨 UI Group by Company' },
  ];

  const filteredReqs = systemRequirements.filter(
    r => selectedCategory === 'all' || r.category === selectedCategory
  );

  const toggleActionItem = (id: number) => {
    setActionItems(prev =>
      prev.map(item => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const copyFullReport = () => {
    const textReport = `# รายงานสรุปการถอดข้อมูลเสียงและความต้องการระบบ (SRS)
การพัฒนาระบบบริหารจัดการการฝึกงานและสหกิจศึกษา คณะ ICT มหาวิทยาลัยพะเยา
จากไฟล์เสียง: 20261111_131225_afb3176a.m4a (ความยาว 70:47 นาที)

${systemRequirements.map((r, i) => `
## ${i + 1}. [${r.category}] ${r.title}
- เวลาในคลิปเสียง: นาทีที่ ${r.discussionTimestamp}
- สภาพปัญหาเดิม: ${r.problemStatement}
- แนวทางแก้ไข/ข้อกำหนดใหม่: ${r.proposedSolution}
- ผู้มีส่วนได้ส่วนเสีย: ${r.stakeholders.join(', ')}
- ระดับความสำคัญ: ${r.priority}
- สิ่งที่ต้องดำเนินการ (Action Items):
${r.actionItems.map(a => `  * ${a}`).join('\n')}
`).join('\n---\n')}
`;

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-white rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              ถอดเทปและวิเคราะห์ความต้องการระบบ (System Requirements Specification)
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              ผลการถอดข้อมูลจากการประชุมพัฒนาระบบสหกิจศึกษา ม.พะเยา
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
              สรุปจากการพูดคุยตรวจสอบระบบระหว่าง <strong>พี่จอม (ผู้ดูแลระบบการศึกษา/สหกิจ)</strong>, 
              <strong>อาจารย์ประจำสาขา</strong>, และ <strong>นักศึกษาผู้พัฒนาระบบ</strong> 
              ครอบคลุมการปรับปรุงกระบวนการฝึกงาน 5 ขั้นตอนหลัก การแก้ปัญหาข้อมูลซ้ำซ้อน และการจัดทำเอกสารราชการ
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={copyFullReport}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm shadow-sm transition active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'คัดลอกรายงานแล้ว!' : 'คัดลอกสรุปข้อกำหนด (Markdown)'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-purple-100/80">
          <div className="bg-white/80 backdrop-blur rounded-xl p-3.5 border border-purple-100">
            <div className="text-2xl font-bold text-purple-700">10 หมวด</div>
            <div className="text-xs text-slate-500 font-medium">ข้อกำหนดระบบหลัก (SRS)</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-3.5 border border-purple-100">
            <div className="text-2xl font-bold text-indigo-700">70:47 นาที</div>
            <div className="text-xs text-slate-500 font-medium">ความยาวไฟล์เสียงประชุม</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-3.5 border border-purple-100">
            <div className="text-2xl font-bold text-emerald-700">5 ขั้นตอน</div>
            <div className="text-xs text-slate-500 font-medium">Timeline ฝึกงาน/สหกิจ</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-3.5 border border-purple-100">
            <div className="text-2xl font-bold text-pink-700">10 รายการ</div>
            <div className="text-xs text-slate-500 font-medium">Action Items ที่ต้องแก้ไข</div>
          </div>
        </div>
      </div>

      {/* Action Items Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              รายการสิ่งที่ต้องปรับปรุงระบบตามที่ตกลงในเทปเสียง (Action Items)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              คลิกเพื่อติ๊กสถานะความคืบหน้าของงานแต่ละส่วน
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
            เสร็จแล้ว {actionItems.filter(i => i.done).length}/{actionItems.length} รายการ
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actionItems.map(item => (
            <div
              key={item.id}
              onClick={() => toggleActionItem(item.id)}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                item.done
                  ? 'bg-slate-50/80 border-slate-200 text-slate-500'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-purple-300 shadow-2xs'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition ${
                item.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
              }`}>
                {item.done && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${item.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px]">
                  <span className={`px-1.5 py-0.5 rounded font-medium ${
                    item.priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-amber-50 text-amber-700'
                  }`}>
                    ความสำคัญ: {item.priority}
                  </span>
                  <span className="text-slate-400">ผู้รับผิดชอบ: {item.assignee}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-medium transition ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 10 Requirements Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredReqs.map((req, idx) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition p-6 relative overflow-hidden group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-xs font-bold border border-indigo-100">
                  {req.id}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {req.category}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  req.priority === 'High' 
                    ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  Priority: {req.priority}
                </span>
              </div>

              <button
                onClick={() => onPlayTimestamp(req.discussionSeconds)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium transition self-start sm:self-auto border border-purple-200/60"
                title="ฟังช่วงที่พูดคุยประเด็นนี้ในไฟล์เสียง"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>ฟังเสียงช่วงนาทีที่ {req.discussionTimestamp}</span>
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {req.title}
            </h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              {req.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  สภาพปัญหา / จุดติดขัดเดิม
                </div>
                <p className="text-xs text-amber-950/80 leading-relaxed">
                  {req.problemStatement}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  แนวทางแก้ไข / ข้อกำหนดใหม่
                </div>
                <p className="text-xs text-emerald-950/80 leading-relaxed">
                  {req.proposedSolution}
                </p>
              </div>
            </div>

            {/* Action Items List for this requirement */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                สิ่งที่ต้องดำเนินการในระบบ (Action Items):
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {req.actionItems.map((act, aIdx) => (
                  <li key={aIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                <span>ผู้เกี่ยวข้อง:</span>
                {req.stakeholders.map((s, sIdx) => (
                  <span key={sIdx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
