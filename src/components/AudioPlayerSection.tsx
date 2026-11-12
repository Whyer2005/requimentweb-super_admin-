import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, SkipBack, SkipForward, Search, Clock, Tag, MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import { TranscriptSegment } from '../types';
import { transcriptHighlights, audioFilePath } from '../data/transcriptionData';

interface AudioPlayerSectionProps {
  currentSeekTime?: number | null;
  onSeekHandled?: () => void;
}

export const AudioPlayerSection: React.FC<AudioPlayerSectionProps> = ({ currentSeekTime, onSeekHandled }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);

  // Handle external seek requests
  useEffect(() => {
    if (currentSeekTime !== undefined && currentSeekTime !== null && audioRef.current) {
      audioRef.current.currentTime = currentSeekTime;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      if (onSeekHandled) onSeekHandled();
    }
  }, [currentSeekTime, onSeekHandled]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(err => {
        console.warn('Audio play error:', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);

      // Find current active segment
      const currentSeg = transcriptHighlights.find(
        (seg, i) => {
          const nextSeg = transcriptHighlights[i + 1];
          const nextTime = nextSeg ? nextSeg.seconds : duration;
          return current >= seg.seconds && current < nextTime;
        }
      );
      if (currentSeg) {
        setActiveSegmentId(currentSeg.id);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 4247); // around 70 mins
    }
  };

  const seekTo = (seconds: number, segmentId?: string) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      if (segmentId) setActiveSegmentId(segmentId);
    }
  };

  const skipSeconds = (delta: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + delta));
    }
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filter segments
  const filteredSegments = transcriptHighlights.filter(seg => {
    const matchesSearch = seg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          seg.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          seg.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (seg.note && seg.note.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || seg.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={audioFilePath}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Player Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-200 border border-purple-400/30 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ไฟล์บันทึกเสียงการประชุมหลัก (70:47 นาที)
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              เครื่องเล่นเสียงพร้อมระบบข้ามไปยังประเด็นสำคัญ (Timestamp Audio Player)
            </h2>
            <p className="text-sm text-purple-200/80 mt-1">
              คลิกที่เวลาหรือหัวข้อด้านล่างเพื่อฟังเสียงจริงช่วงที่พูดคุยประเด็นนั้นได้ทันที
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 self-start md:self-auto">
            <span className="text-xs text-purple-200">ความเร็ว:</span>
            {[1, 1.25, 1.5, 2].map(speed => (
              <button
                key={speed}
                onClick={() => changeSpeed(speed)}
                className={`px-2 py-0.5 text-xs rounded font-medium transition ${
                  playbackRate === speed
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'text-purple-200 hover:bg-white/10'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Audio Player Controls */}
        <div className="bg-slate-950/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-mono text-purple-200 min-w-10">
              {formatTime(currentTime)}
            </span>
            <div
              className="relative flex-1 h-3 bg-white/15 rounded-full cursor-pointer overflow-hidden group"
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                seekTo(pos * (duration || 4247));
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all"
                style={{ width: `${((currentTime / (duration || 4247)) * 100).toFixed(2)}%` }}
              />
            </div>
            <span className="text-xs font-mono text-purple-200 min-w-10 text-right">
              {formatTime(duration || 4247)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => skipSeconds(-15)}
                className="p-2 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition text-xs flex items-center gap-1"
                title="ย้อนกลับ 15 วินาที"
              >
                <SkipBack className="w-4 h-4" />
                <span>-15s</span>
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white flex items-center justify-center shadow-lg shadow-purple-900/50 transition transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <button
                onClick={() => skipSeconds(15)}
                className="p-2 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition text-xs flex items-center gap-1"
                title="ข้ามไป 15 วินาที"
              >
                <span>+15s</span>
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-purple-200/90">
              <Volume2 className="w-4 h-4 text-purple-400" />
              <span>ไฟล์ต้นฉบับ: 20261111_131225_afb3176a.m4a</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาข้อความ, หัวข้อ, หรือคำพูดในคลิปเสียง (เช่น บริษัทซ้ำ, อบรม, อว., ดรอปนิสิต)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'company', label: '🏢 บริษัท/ยุบรวม' },
              { id: 'document', label: '📄 เอกสาร อว.' },
              { id: 'training', label: '📅 อบรม/เช็คชื่อ' },
              { id: 'advisor', label: '👨‍🏫 อาจารย์นิเทศก์' },
              { id: 'student', label: '👨‍🎓 ข้อมูลนิสิต' },
              { id: 'ui', label: '🎨 UI & Workflow' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transcript Highlight Cards */}
      <div className="p-4 sm:p-6 divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
        {filteredSegments.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">ไม่พบข้อความที่ตรงกับคำค้นหา "{searchQuery}"</p>
          </div>
        ) : (
          filteredSegments.map(segment => {
            const isActive = activeSegmentId === segment.id;
            return (
              <div
                key={segment.id}
                className={`py-4 px-3 sm:px-4 rounded-xl transition duration-150 ${
                  isActive ? 'bg-purple-50/80 border border-purple-200' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => seekTo(segment.seconds, segment.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      }`}
                      title="กดเพื่อฟังเสียงช่วงนี้"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{segment.timestamp}</span>
                    </button>
                    <span className="font-semibold text-sm text-slate-800">
                      {segment.topic}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                      {segment.speaker}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    นาทีที่ {segment.timestamp}
                  </span>
                </div>

                {/* Direct quote */}
                <div className="flex items-start gap-2.5 text-sm text-slate-700 bg-slate-50/50 p-3 rounded-lg border border-slate-100 my-2">
                  <MessageSquareQuote className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <p className="italic leading-relaxed">{segment.text}</p>
                </div>

                {/* Developer note / System requirement conclusion */}
                {segment.note && (
                  <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-md mt-1 border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>ข้อสรุป Requirement:</strong> {segment.note}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
