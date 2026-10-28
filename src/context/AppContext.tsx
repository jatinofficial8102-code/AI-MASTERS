import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../utils/supabase/client';
import {
  StudentProfile,
  AcademicRecord,
  DocumentItem,
  VerificationStep,
  Institution,
  ConsentItem,
  NotificationItem,
} from '../types';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  user: User | null;
  session: Session | null;
  authLoading: boolean;
  isOwner: boolean;
  publicRegistrationEnabled: boolean;
  updateRegistrationPolicy: (enabled: boolean) => Promise<boolean>;
  student: StudentProfile | null;
  updateStudent: (updated: Partial<StudentProfile>) => Promise<boolean>;
  academicRecords: AcademicRecord[];
  loadingRecords: boolean;
  addAcademicRecord: (rec: Omit<AcademicRecord, 'id'>) => Promise<boolean>;
  documents: DocumentItem[];
  loadingDocs: boolean;
  addDocument: (doc: Omit<DocumentItem, 'id'>) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;
  verificationSteps: VerificationStep[];
  institutions: Institution[];
  consents: ConsentItem[];
  toggleConsentStatus: (id: string) => Promise<boolean>;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  activeModal: string | null;
  openModal: (modalName: string, modalData?: any) => void;
  closeModal: () => void;
  modalData: any;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const OWNER_EMAIL = 'jathin.cybersecurity@gmail.com';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [publicRegistrationEnabled, setPublicRegistrationEnabled] = useState(false);

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [consents, setConsents] = useState<ConsentItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isOwner = Boolean(user?.email && user.email.toLowerCase() === OWNER_EMAIL.toLowerCase());

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Registration Policy Fetcher from public.app_settings
  const fetchRegistrationPolicy = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'registration_policy')
        .maybeSingle();

      if (!error && data && data.value) {
        const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        setPublicRegistrationEnabled(Boolean(val.public_registration_enabled));
      }
    } catch (err) {
      console.warn('[Registration Policy Query Notice]:', err);
    }
  };

  // Initial Auth Listener, Session loader & Settings sync
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured) {
        setAuthLoading(false);
        return;
      }

      await fetchRegistrationPolicy();

      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[Supabase Auth Error]:', error.message);
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user || null);
          setAuthLoading(false);
        }
      } catch (err) {
        console.error('[Auth Init Error]:', err);
        if (mounted) setAuthLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch real data when user logs in
  const refreshUserData = async () => {
    if (!user || !isSupabaseConfigured) {
      setStudent(null);
      setAcademicRecords([]);
      setDocuments([]);
      setConsents([]);
      setNotifications([]);
      return;
    }

    // 1. Fetch Profile
    try {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileErr && profileErr.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileErr.message);
      }

      if (profileData) {
        const apaar = profileData.apaar_id || '0824-0000-0000';
        const masked = apaar.length >= 14 ? `${apaar.slice(0, 4)} •••• •••• ${apaar.slice(-4)}` : apaar;
        setStudent({
          id: profileData.id,
          name: profileData.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Authenticated Student',
          email: profileData.email || user.email || '',
          apaarId: apaar,
          maskedId: masked,
          abcId: profileData.abc_id || undefined,
          aadhaarRef: profileData.phone ? `Verified Mobile: ${profileData.phone}` : 'Aadhaar e-KYC Pending',
          rollNo: profileData.roll_no || 'Unassigned',
          course: profileData.course || 'Degree Program Not Set',
          specialization: profileData.specialization || 'General',
          institution: profileData.institution || 'Institution Affiliation Pending',
          institutionCode: profileData.institution_code || 'N/A',
          academicYear: profileData.academic_year || `${new Date().getFullYear()} - ${new Date().getFullYear() + 4}`,
          currentSemester: profileData.current_semester || 1,
          totalSemesters: profileData.total_semesters || 8,
          cgpa: profileData.cgpa ? parseFloat(profileData.cgpa) : 0.0,
          creditsAccumulated: profileData.credits_accumulated || 0,
          totalCreditsRequired: profileData.total_credits_required || 160,
          profileCompletionPercentage: profileData.profile_completion || 30,
          avatarUrl: profileData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.email || 'User')}`,
          status: profileData.role === 'owner' ? 'Active & Verified' : 'Pending Verification',
          phone: profileData.phone || '',
          dob: profileData.dob || '',
          gender: profileData.gender || '',
          bloodGroup: profileData.blood_group || '',
          address: profileData.address || '',
          role: profileData.role || (isOwner ? 'owner' : 'student'),
        });
      } else {
        // Fallback profile if row does not exist yet
        const defaultApaar = `0824-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
        setStudent({
          id: user.id,
          name: user.user_metadata?.full_name || (isOwner ? 'Jatin' : user.email?.split('@')[0] || 'Authenticated User'),
          email: user.email || '',
          apaarId: defaultApaar,
          maskedId: `${defaultApaar.slice(0, 4)} •••• •••• ${defaultApaar.slice(-4)}`,
          status: isOwner ? 'Active & Verified' : 'Pending Verification',
          profileCompletionPercentage: 35,
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.email || 'User')}`,
          role: isOwner ? 'owner' : 'student',
        });
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }

    // 2. Fetch Academic Records
    setLoadingRecords(true);
    try {
      const { data: recs, error: recsErr } = await supabase
        .from('academic_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (recsErr) {
        console.warn('Academic records query notice:', recsErr.message);
        setAcademicRecords([]);
      } else {
        setAcademicRecords(
          (recs || []).map((r) => ({
            id: r.id,
            title: r.title,
            recordType: r.record_type,
            institution: r.institution,
            boardOrUniversity: r.board_or_university || '',
            academicYear: r.academic_year,
            score: r.score,
            creditsEarned: r.credits_earned || 0,
            status: r.verification_status,
            verifiedBy: r.verified_by,
            verifiedDate: r.verified_date,
            verificationHash: r.verification_hash,
            createdAt: r.created_at,
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching academic records:', err);
      setAcademicRecords([]);
    } finally {
      setLoadingRecords(false);
    }

    // 3. Fetch Documents
    setLoadingDocs(true);
    try {
      const { data: docs, error: docsErr } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (docsErr) {
        console.warn('Documents query notice:', docsErr.message);
        setDocuments([]);
      } else {
        setDocuments(
          (docs || []).map((d) => ({
            id: d.id,
            name: d.name,
            category: d.category,
            fileType: d.file_type,
            fileSize: d.file_size,
            uploadedAt: new Date(d.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            status: d.verification_status,
            verificationHash: d.verification_hash || 'SHA256: Generated',
            issuer: d.issuer || 'Official Issuer',
            storagePath: d.storage_path,
            verifiedBy: d.verified_by,
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setDocuments([]);
    } finally {
      setLoadingDocs(false);
    }

    // 4. Fetch Consents
    try {
      const { data: consentData, error: consentErr } = await supabase
        .from('consents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (consentErr) {
        setConsents([]);
      } else {
        setConsents(
          (consentData || []).map((c) => ({
            id: c.id,
            requesterName: c.requester_name,
            requesterType: c.requester_type,
            purpose: c.purpose,
            requestedFields: c.requested_fields || [],
            status: c.status,
            grantedDate: new Date(c.created_at).toLocaleDateString(),
            expiryDate: c.expiry_date || 'Ongoing',
            securityLevel: c.security_level,
          }))
        );
      }
    } catch (err) {
      setConsents([]);
    }

    // 5. Fetch Notifications
    try {
      const { data: notifData, error: notifErr } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (notifErr) {
        setNotifications([]);
      } else {
        setNotifications(
          (notifData || []).map((n) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            timestamp: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: n.type,
            read: n.read,
            actionPath: n.action_path,
          }))
        );
      }
    } catch (err) {
      setNotifications([]);
    }
  };

  useEffect(() => {
    if (user) {
      refreshUserData();
    } else {
      setStudent(null);
      setAcademicRecords([]);
      setDocuments([]);
      setConsents([]);
      setNotifications([]);
    }
  }, [user]);

  // Real Database Mutators
  const updateStudent = async (updated: Partial<StudentProfile>): Promise<boolean> => {
    if (!user) return false;

    try {
      const payload: any = {
        updated_at: new Date().toISOString(),
      };
      if (updated.name) payload.full_name = updated.name;
      if (updated.phone) payload.phone = updated.phone;
      if (updated.dob) payload.dob = updated.dob;
      if (updated.gender) payload.gender = updated.gender;
      if (updated.bloodGroup) payload.blood_group = updated.bloodGroup;
      if (updated.address) payload.address = updated.address;
      if (updated.course) payload.course = updated.course;
      if (updated.specialization) payload.specialization = updated.specialization;
      if (updated.institution) payload.institution = updated.institution;

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id);

      if (error) {
        showToast('Update Failed', error.message, 'error');
        return false;
      }

      setStudent((prev) => (prev ? { ...prev, ...updated } : null));
      showToast('Profile Saved', 'Your student details have been updated in Supabase.', 'success');
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Could not update profile', 'error');
      return false;
    }
  };

  const updateRegistrationPolicy = async (enabled: boolean): Promise<boolean> => {
    if (!user || !isOwner) {
      showToast('Unauthorized', 'Only the verified institution owner can update registration policy.', 'error');
      return false;
    }

    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'registration_policy',
          value: {
            public_registration_enabled: enabled,
            owner_email: OWNER_EMAIL,
            updated_by: user.id,
            updated_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        });

      if (error) {
        showToast('Policy Update Failed', error.message, 'error');
        return false;
      }

      setPublicRegistrationEnabled(enabled);
      showToast(
        'Registration Policy Updated',
        enabled
          ? 'Public student registration is now OPEN.'
          : 'Public registration is now RESTRICTED (Admin Provisioning Only).',
        'success'
      );
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Could not update registration policy', 'error');
      return false;
    }
  };

  const addAcademicRecord = async (rec: Omit<AcademicRecord, 'id'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('academic_records')
        .insert({
          user_id: user.id,
          title: rec.title,
          record_type: rec.recordType,
          institution: rec.institution,
          board_or_university: rec.boardOrUniversity || '',
          academic_year: rec.academicYear,
          score: rec.score,
          credits_earned: rec.creditsEarned || 0,
          verification_status: 'Pending',
          verification_hash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        })
        .select()
        .single();

      if (error) {
        showToast('Record Failed', error.message, 'error');
        return false;
      }

      if (data) {
        const newRecord: AcademicRecord = {
          id: data.id,
          title: data.title,
          recordType: data.record_type,
          institution: data.institution,
          boardOrUniversity: data.board_or_university,
          academicYear: data.academic_year,
          score: data.score,
          creditsEarned: data.credits_earned,
          status: data.verification_status,
          verificationHash: data.verification_hash,
          createdAt: data.created_at,
        };
        setAcademicRecords((prev) => [newRecord, ...prev]);
        showToast('Academic Record Added', `${rec.title} logged in database with status 'Pending'.`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast('Error', err.message || 'Could not add record', 'error');
      return false;
    }
  };

  const addDocument = async (doc: Omit<DocumentItem, 'id'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          name: doc.name,
          category: doc.category,
          file_type: doc.fileType,
          file_size: doc.fileSize,
          storage_path: doc.storagePath || `uploads/${user.id}/${Date.now()}_${doc.name}`,
          verification_status: 'Pending',
          verification_hash: doc.verificationHash || `SHA256:${Math.random().toString(16).substring(2, 12)}`,
          issuer: doc.issuer,
        })
        .select()
        .single();

      if (error) {
        showToast('Upload Failed', error.message, 'error');
        return false;
      }

      if (data) {
        const newDoc: DocumentItem = {
          id: data.id,
          name: data.name,
          category: data.category,
          fileType: data.file_type,
          fileSize: data.file_size,
          uploadedAt: 'Just now',
          status: data.verification_status,
          verificationHash: data.verification_hash,
          issuer: data.issuer,
        };
        setDocuments((prev) => [newDoc, ...prev]);
        showToast('Document Recorded', `${doc.name} metadata logged in Supabase.`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast('Error', err.message || 'Could not save document', 'error');
      return false;
    }
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        showToast('Delete Failed', error.message, 'error');
        return false;
      }

      setDocuments((prev) => prev.filter((d) => d.id !== id));
      showToast('Document Deleted', 'Record removed from Supabase.', 'info');
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Could not delete document', 'error');
      return false;
    }
  };

  const toggleConsentStatus = async (id: string): Promise<boolean> => {
    if (!user) return false;

    const current = consents.find((c) => c.id === id);
    if (!current) return false;

    const nextStatus = current.status === 'Active' ? 'Revoked' : 'Active';

    try {
      const { error } = await supabase
        .from('consents')
        .update({ status: nextStatus })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        showToast('Consent Update Failed', error.message, 'error');
        return false;
      }

      setConsents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
      );

      showToast(
        nextStatus === 'Active' ? 'Consent Authorized' : 'Consent Revoked',
        `Database updated: access for ${current.requesterName} is now ${nextStatus.toLowerCase()}.`,
        nextStatus === 'Active' ? 'success' : 'info'
      );
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Could not update consent', 'error');
      return false;
    }
  };

  const markNotificationAsRead = async (id: string): Promise<void> => {
    if (!user) return;
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id).eq('user_id', user.id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsAsRead = async (): Promise<void> => {
    if (!user) return;
    try {
      await supabase.from('notifications').update({ read: true }).eq('user_id', user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      showToast('Notifications Cleared', 'All notifications marked as read in database.', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const signOut = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setSession(null);
      setStudent(null);
      setAcademicRecords([]);
      setDocuments([]);
      setConsents([]);
      setNotifications([]);
      showToast('Signed Out', 'You have been securely signed out of your APAAR session.', 'info');
    } catch (err: any) {
      showToast('Sign Out Notice', err.message || 'Session ended', 'info');
    }
  };

  // Dynamic real verification milestones based on actual database contents
  const verificationSteps: VerificationStep[] = [
    {
      id: 1,
      title: 'Identity Verification',
      subtitle: student?.email || 'Aadhaar / Email Auth',
      status: user ? 'Completed' : 'Pending',
      completedDate: user ? 'Supabase Auth Verified' : 'Awaiting Login',
      verifiedBy: 'Supabase Cryptographic Identity Provider',
      remarks: user
        ? `Authenticated via Supabase Auth UUID: ${user.id}`
        : 'Sign in required to verify identity attributes.',
      securityHash: user ? `0x${user.id.replace(/-/g, '').slice(0, 32)}` : undefined,
    },
    {
      id: 2,
      title: 'Academic Records',
      subtitle: `${academicRecords.length} Records Logged`,
      status: academicRecords.some((r) => r.status === 'Verified')
        ? 'Completed'
        : academicRecords.length > 0
        ? 'In Progress'
        : 'Pending',
      completedDate: academicRecords.length > 0 ? `${academicRecords.length} records in queue` : 'No records yet',
      verifiedBy: 'Authorized Academic Registrar',
      remarks: academicRecords.length > 0
        ? `${academicRecords.filter((r) => r.status === 'Verified').length} of ${academicRecords.length} records verified by institution.`
        : 'No academic records submitted for verification yet.',
    },
    {
      id: 3,
      title: 'Documents',
      subtitle: `${documents.length} Files Uploaded`,
      status: documents.some((d) => d.status === 'Verified')
        ? 'Completed'
        : documents.length > 0
        ? 'In Progress'
        : 'Pending',
      completedDate: documents.length > 0 ? `${documents.length} files in vault` : 'No documents',
      verifiedBy: 'National Depository (NAD)',
      remarks: documents.length > 0
        ? `${documents.filter((d) => d.status === 'Verified').length} verified document(s).`
        : 'Upload transcripts or certifications to initiate document verification.',
    },
    {
      id: 4,
      title: 'Institution Verification',
      subtitle: student?.institution || 'AICTE Accreditation',
      status: student?.status === 'Active & Verified' ? 'Completed' : 'Pending',
      completedDate: student?.status === 'Active & Verified' ? 'AICTE Verified Node' : 'Pending Review',
      verifiedBy: 'AICTE Master Registry',
      remarks: student?.status === 'Active & Verified'
        ? 'Profile is registered and active in the central academic directory.'
        : 'Complete profile and upload verified records for final institution sign-off.',
    },
  ];

  const openModal = (name: string, data?: any) => {
    setActiveModal(name);
    setModalData(data || null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        session,
        authLoading,
        isOwner,
        publicRegistrationEnabled,
        updateRegistrationPolicy,
        student,
        updateStudent,
        academicRecords,
        loadingRecords,
        addAcademicRecord,
        documents,
        loadingDocs,
        addDocument,
        deleteDocument,
        verificationSteps,
        institutions,
        consents,
        toggleConsentStatus,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toasts,
        showToast,
        removeToast,
        activeModal,
        openModal,
        closeModal,
        modalData,
        searchTerm,
        setSearchTerm,
        sidebarCollapsed,
        setSidebarCollapsed,
        signOut,
        refreshUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
