export interface TranscriptSegment {
  id: string;
  timestamp: string; // e.g. "00:05", "15:15"
  seconds: number;
  speaker: string;
  topic: string;
  text: string;
  note?: string;
  category: 'workflow' | 'company' | 'document' | 'student' | 'training' | 'advisor' | 'ui';
}

export interface SystemRequirement {
  id: string;
  category: string;
  title: string;
  description: string;
  problemStatement: string;
  proposedSolution: string;
  discussionTimestamp: string;
  discussionSeconds: number;
  priority: 'High' | 'Medium' | 'Low';
  stakeholders: string[];
  status: 'Design Phase' | 'Needs Revision' | 'Approved';
  actionItems: string[];
}

export interface Student {
  id: string; // e.g. "67024964"
  nameTh: string;
  nameEn: string;
  faculty: string;
  major: string; // e.g. "Software Engineering"
  curriculum: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  advisorId: string;
  visitingAdvisorId?: string;
  status: 'active' | 'dropped' | 'pending';
  appliedCompanyId?: string;
  position?: string;
  workflowStep: 1 | 2 | 3 | 4 | 5;
  // Documents
  requestLetterNumber?: string;
  requestLetterDate?: string;
  requestLetterStatus?: 'none' | 'pending_approval' | 'issued';
  acceptanceLetterStatus?: 'none' | 'uploaded' | 'verified_advisor' | 'approved_admin';
  acceptanceFileUrl?: string;
  sendingLetterNumber?: string;
  sendingLetterDate?: string;
  sendingLetterStatus?: 'none' | 'issued';
}

export interface Company {
  id: string;
  nameTh: string;
  nameEn: string;
  originalSubmittedNames: string[];
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  contactPosition: string;
  isVerified: boolean;
  status: 'active' | 'pending_review' | 'merged';
  mergedIntoId?: string;
  allowedPositions: string[];
}

export interface TrainingActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  maxSeats: number;
  reserveSeats: number;
  registeredCount: number;
  reserveCount: number;
  registrationOpenDaysBefore: number;
  status: 'upcoming' | 'open' | 'closed' | 'completed';
}

export interface Advisor {
  id: string;
  name: string;
  department: string;
  role: 'อาจารย์ที่ปรึกษา' | 'อาจารย์นิเทศก์' | 'อาจารย์ประจำวิชา' | 'ผู้ดูแลระบบ (พี่จอม)';
  visitingRegion?: 'กรุงเทพฯ และปริมณฑล' | 'ภาคเหนือ/เชียงใหม่' | 'อื่นๆ';
}
