import { addDoc, collection, doc, increment, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function trackTemplateDownload(userId: string, templateId: string) {
  await runTransaction(db, async (tx) => {
    const templateRef = doc(db, 'templates', templateId);
    tx.update(templateRef, {
      downloadCount: increment(1),
      lastDownloadedAt: serverTimestamp(),
    });
  });

  await addDoc(collection(db, 'downloads'), {
    userId,
    templateId,
    downloadedAt: serverTimestamp(),
  });
}

