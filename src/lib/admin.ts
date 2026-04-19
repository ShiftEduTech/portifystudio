import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  orderBy,
  query,
  limit,
  updateDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface AdminTemplate {
  id: string;
  title: string;
  description?: string;
  category?: string;
  images?: string[];
  githubUrl?: string;
  liveUrl?: string;
  zipUrl?: string;
  downloadCount?: number;
  viewCount?: number;
  status?: 'draft' | 'published';
  isFeatured?: boolean;
  createdAt?: Timestamp;
}

export interface AdminUser {
  uid: string;
  fullName?: string;
  name?: string;
  email?: string;
  role?: 'user' | 'admin' | string;
  plan?: 'free' | 'premium' | 'pro' | string;
  status?: 'active' | 'suspended' | string;
  createdAt?: Timestamp;
}

export interface DownloadEvent {
  id: string;
  userId: string;
  templateId: string;
  downloadedAt?: Timestamp;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetId: string;
  timestamp: Timestamp;
}

export interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  active: boolean;
  createdAt: Timestamp;
}

export async function getTemplates(): Promise<AdminTemplate[]> {
  try {
    const snap = await getDocs(collection(db, 'templates'));
    const data = snap.docs.map((item) => ({ 
      id: item.id, 
      ...(item.data() as Omit<AdminTemplate, 'id'>) 
    }));
    
    // Sort in memory to avoid query failure if fields are missing
    return data.sort((a, b) => (b.downloadCount ?? 0) - (a.downloadCount ?? 0));
  } catch (error) {
    console.error('getTemplates error:', error);
    return [];
  }
}

export async function getUsers(): Promise<AdminUser[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const users = snap.docs.map((item) => ({ 
      uid: item.id, 
      ...(item.data() as Omit<AdminUser, 'uid'>) 
    }));
    
    // Sort in memory to avoid query failure if createdAt is missing
    return users.sort((a, b) => {
      const dateA = a.createdAt?.seconds ?? 0;
      const dateB = b.createdAt?.seconds ?? 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error('getUsers error:', error);
    return [];
  }
}

export async function getDownloads(maxItems = 1000): Promise<DownloadEvent[]> {
  try {
    const snap = await getDocs(query(collection(db, 'downloads'), limit(maxItems)));
    const data = snap.docs.map((item) => ({ 
      id: item.id, 
      ...(item.data() as Omit<DownloadEvent, 'id'>) 
    }));
    
    // Sort in memory for safety
    return data.sort((a, b) => {
      const dateA = a.downloadedAt?.seconds ?? 0;
      const dateB = b.downloadedAt?.seconds ?? 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error('getDownloads error:', error);
    return [];
  }
}

export function toDayLabel(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
}

export function buildRecentDailyDownloads(downloads: DownloadEvent[], days = 7) {
  const now = new Date();
  const keys: { key: string; label: string }[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    keys.push({ key, label: toDayLabel(d) });
  }

  const map = new Map(keys.map((k) => [k.key, 0]));
  downloads.forEach((item) => {
    if (!item.downloadedAt) return;
    const key = item.downloadedAt.toDate().toISOString().slice(0, 10);
    if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
  });

  return keys.map((k) => ({
    day: k.label,
    downloads: map.get(k.key) || 0,
  }));
}

export async function resolveTemplateTitle(templateId: string) {
  const docSnap = await getDoc(doc(db, 'templates', templateId));
  return docSnap.exists() ? (docSnap.data().title as string) : 'Unknown Template';
}

export async function addAuditLog(adminId: string, adminEmail: string, action: string, targetId: string) {
  await addDoc(collection(db, 'admin_logs'), {
    adminId,
    adminEmail,
    action,
    targetId,
    timestamp: serverTimestamp(),
  });
}

export async function getAuditLogs(maxItems = 100): Promise<AdminLog[]> {
  try {
    const snap = await getDocs(query(collection(db, 'admin_logs'), orderBy('timestamp', 'desc'), limit(maxItems)));
    return snap.docs.map(item => ({ id: item.id, ...item.data() } as AdminLog));
  } catch (error) {
    console.error('getAuditLogs error:', error);
    return [];
  }
}

export async function updateUserRole(uid: string, role: string, adminId?: string, adminEmail?: string) {
  await updateDoc(doc(db, 'users', uid), { role });
  if (adminId && adminEmail) {
    await addAuditLog(adminId, adminEmail, `Updated user role to ${role}`, uid);
  }
}

export async function updateUserPlan(uid: string, plan: string, adminId?: string, adminEmail?: string) {
  await updateDoc(doc(db, 'users', uid), { plan });
  if (adminId && adminEmail) {
    await addAuditLog(adminId, adminEmail, `Updated user plan to ${plan}`, uid);
  }
}

export async function updateUserStatus(uid: string, status: 'active' | 'suspended', adminId?: string, adminEmail?: string) {
  await updateDoc(doc(db, 'users', uid), { status });
  if (adminId && adminEmail) {
    await addAuditLog(adminId, adminEmail, `Updated user status to ${status}`, uid);
  }
}

export async function updateTemplate(id: string, updates: Partial<AdminTemplate>, adminId?: string, adminEmail?: string) {
  await updateDoc(doc(db, 'templates', id), updates);
  if (adminId && adminEmail) {
    const fields = Object.keys(updates).join(', ');
    await addAuditLog(adminId, adminEmail, `Updated template fields: ${fields}`, id);
  }
}

export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const snap = await getDocs(query(collection(db, 'announcements'), orderBy('createdAt', 'desc')));
    return snap.docs.map(item => ({ id: item.id, ...item.data() } as Announcement));
  } catch (error) {
    console.error('getAnnouncements error:', error);
    return [];
  }
}

export async function addAnnouncement(message: string, type: 'info' | 'warning' | 'success', adminId?: string, adminEmail?: string) {
  const docRef = await addDoc(collection(db, 'announcements'), {
    message,
    type,
    active: true,
    createdAt: serverTimestamp(),
  });
  if (adminId && adminEmail) {
    await addAuditLog(adminId, adminEmail, `Created announcement: ${message.slice(0, 30)}...`, docRef.id);
  }
}

export async function deleteAnnouncement(id: string, adminId?: string, adminEmail?: string) {
  await deleteDoc(doc(db, 'announcements', id));
  if (adminId && adminEmail) {
    await addAuditLog(adminId, adminEmail, 'Deleted announcement', id);
  }
}

export async function toggleAnnouncementActive(id: string, active: boolean, adminId?: string, adminEmail?: string) {
  await updateDoc(doc(db, 'announcements', id), { active });
  if (adminId && adminEmail) {
    await addAuditLog(adminId, adminEmail, `${active ? 'Enabled' : 'Disabled'} announcement`, id);
  }
}

