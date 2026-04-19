import { collection, doc, increment, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Tracks a template download with rich metadata and atomic consistency.
 * Captures device info, increments global counters, and logs the event.
 */
export async function trackTemplateDownload(userId: string, templateId: string, templateTitle: string, templateImage: string) {
  if (!userId || !templateId) return;

  // Capture realistic client metadata
  const metadata = {
    platform: typeof window !== 'undefined' ? window.navigator.platform : 'unknown',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    language: typeof window !== 'undefined' ? window.navigator.language : 'unknown',
    screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'unknown',
  };

  try {
    await runTransaction(db, async (transaction) => {
      const templateRef = doc(db, 'templates', templateId);
      const downloadLogRef = doc(collection(db, 'downloads'));

      // 1. Increment global download count on the template
      transaction.update(templateRef, {
        downloadCount: increment(1),
        lastDownloadedAt: serverTimestamp(),
      });

      // 2. Create a detailed audit log entry
      transaction.set(downloadLogRef, {
        userId,
        templateId,
        templateTitle,
        templateImage,
        downloadedAt: serverTimestamp(),
        metadata,
        status: 'completed',
        source: 'web_portal'
      });
    });
  } catch (error) {
    // We log but don't re-throw to avoid blocking the user's actual download
    console.error('[DownloadTracker] Failed to record event:', error);
  }
}

