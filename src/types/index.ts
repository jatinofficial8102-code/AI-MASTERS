export interface StudentProfile {
  id?: string;
  apaarId: string;
  maskedId: string;
  abcId?: string;
  aadhaarRef?: string;
  rollNo?: string;
  name: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  email: string;
  phone?: string;
  course?: string;
  specialization?: string;
  institution?: string;
  institutionCode?: string;
  academicYear?: string;
  currentSemester?: number;
  totalSemesters?: number;
  cgpa?: number;
  creditsAccumulated?: number;
  totalCreditsRequired?: number;
  profileCompletionPercentage: number;
  avatarUrl?: string;
  status: 'Active & Verified' | 'Pending Verification' | 'Requires Update';
  fatherName?: string;
  motherName?: string;
  address?: string;
  category?: string;
  role?: 'student' | 'owner' | 'admin' | 'verifier';
}

export interface AcademicRecord {
  id: string;
  user_id?: string;
  title: string;
  recordType: string;
  institution: string;
  boardOrUniversity?: string;
  academicYear: string;
  score: string;
  creditsEarned?: number;
  status: 'Verified' | 'Under Review' | 'Pending' | 'Rejected';
  verifiedBy?: string;
  verifiedDate?: string;
  documentRef?: string;
  verificationHash?: string;
  subjects?: { name: string; grade: string; credits?: number }[];
  createdAt?: string;
}

export interface DocumentItem {
  id: string;
  user_id?: string;
  name: string;
  category: 'Academic' | 'Identity' | 'Certificate' | 'Migration' | 'Caste/EWS';
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  status: 'Verified' | 'Under Review' | 'Pending' | 'Rejected';
  verificationHash: string;
  issuer: string;
  storagePath?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface VerificationStep {
  id: number;
  title: string;
  subtitle: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  completedDate?: string;
  verifiedBy?: string;
  remarks: string;
  securityHash?: string;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  type: string;
  nirfRank?: number;
  city: string;
  state: string;
  aicteApproved: boolean;
  naacGrade?: string;
  studentStatus?: string;
  transferredCredits?: number;
  programsCount?: number;
  liaisonOfficer?: string;
  contactEmail?: string;
  logoColor?: string;
}

export interface ConsentItem {
  id: string;
  user_id?: string;
  requesterName: string;
  requesterType: string;
  purpose: string;
  requestedFields: string[];
  status: 'Active' | 'Revoked' | 'Expired';
  grantedDate: string;
  expiryDate: string;
  securityLevel?: string;
}

export interface NotificationItem {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'verification' | 'consent' | 'academic' | 'security' | 'system';
  read: boolean;
  actionPath?: string;
}
