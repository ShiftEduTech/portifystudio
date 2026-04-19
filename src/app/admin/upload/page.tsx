'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Upload, Link2, FileCode, X, CheckCircle2, Loader2, ArrowLeft, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const CATEGORIES = ['MERN', 'Java', 'Python', 'DevOps', 'Next.js', 'AWS', 'React', 'Angular', 'Vue', 'Django'];
const TEMPLATE_TIERS = ['free', 'premium', 'pro'] as const;

interface FormState {
  title: string;
  description: string;
  category: string;
  templateTier: (typeof TEMPLATE_TIERS)[number];
  techStack: string;
  githubUrl: string;
  liveUrl: string;
}

export default function AdminUpload() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('edit');

  const [form, setForm] = useState<FormState>({
    title: '', description: '', category: '',
    templateTier: 'free',
    techStack: '',
    githubUrl: '', liveUrl: '',
  });
  
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['', '', '', '']);
  const [imageUrlErrors, setImageUrlErrors] = useState<boolean[]>([false, false, false, false]);
  const [zipUrl, setZipUrl] = useState<string>('');
  
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fetching, setFetching] = useState(false);

  // Load data for editing
  useEffect(() => {
    if (editId) {
      const load = async () => {
        setFetching(true);
        try {
          const docSnap = await getDoc(doc(db, 'templates', editId));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setForm({
              title: data.title || '',
              description: data.description || '',
              category: data.category || '',
              templateTier: data.templateTier || 'free',
              techStack: Array.isArray(data.techStack) ? data.techStack.join(', ') : '',
              githubUrl: data.githubUrl || '',
              liveUrl: data.liveUrl || '',
            });
            setExistingImages(data.images || []);
            setZipUrl(data.zipUrl || '');
          }
        } catch (err) {
          console.error('Failed to load template for editing:', err);
          toast.error('Failed to load template data');
        } finally {
          setFetching(false);
        }
      };
      load();
    }
  }, [editId]);

  // const zipInputRef = useRef<HTMLInputElement>(null);

  const f = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  const removeExistingImage = (url: string) => {
    setExistingImages(p => p.filter(u => u !== url));
  };

  // Removed onZipDrop as it is no longer used for file uploads.

  // Valid URL images (non-empty, no error)
  const validImageUrls = useMemo(() => 
    imageUrls.filter((url, i) => url.trim() !== '' && !imageUrlErrors[i]),
    [imageUrls, imageUrlErrors]
  );

  // Image URL handling
  const updateImageUrl = (index: number, value: string) => {
    setImageUrls(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
    // Reset error state when user types
    setImageUrlErrors(prev => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  const handleImageUrlError = (index: number) => {
    setImageUrlErrors(prev => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const clearImageUrl = (index: number) => {
    setImageUrls(prev => {
      const updated = [...prev];
      updated[index] = '';
      return updated;
    });
    setImageUrlErrors(prev => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  // Removed uploadFile helper as we are now fully URL-based.

  const slugify = (text: string) => 
    text.toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalImages = existingImages.length + validImageUrls.length;
    
    if (!form.title || !form.description || !form.category || !form.techStack || !form.githubUrl || !form.liveUrl || !zipUrl || totalImages < 1) {
      toast.error('Please fill all required fields and add at least 1 screenshot URL + zip URL.');
      return;
    }

    setSubmitting(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 85) { clearInterval(interval); return 85; }
        return p + 5;
      });
    }, 300);

    try {
      const finalImageUrls = [...existingImages, ...validImageUrls];
      
      // Perfect Tech Stack logic: trim, unique, non-empty
      const techStackArray = Array.from(new Set(
        form.techStack.split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0)
      ));

      // 3. Firestore update
      toast.loading('Saving template data...', { id: 'upload-status' });
      
      const templateData = {
        title: form.title.trim(),
        titleLowercase: form.title.trim().toLowerCase(),
        slug: slugify(form.title.trim()),
        description: form.description.trim(),
        category: form.category,
        templateTier: form.templateTier,
        techStack: techStackArray,
        githubUrl: form.githubUrl.trim(),
        liveUrl: form.liveUrl.trim(),
        images: finalImageUrls,
        zipUrl: zipUrl.trim(),
        updatedAt: serverTimestamp(),
      };

      if (editId) {
        await updateDoc(doc(db, 'templates', editId), templateData);
        toast.success('Template updated successfully!', { id: 'upload-status' });
      } else {
        await addDoc(collection(db, 'templates'), {
          ...templateData,
          status: 'published',
          isFeatured: false,
          downloadCount: 0,
          viewCount: 0,
          createdAt: serverTimestamp(),
        });
        toast.success('Template published successfully!', { id: 'upload-status' });
      }

      clearInterval(interval);
      setProgress(100);
      setDone(true);
    } catch (err: any) {
      clearInterval(interval);
      console.error('Upload Error:', err);
      toast.error(err.message || 'Save failed.', { id: 'upload-status' });
      setProgress(0);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm({
      title: '',
      description: '',
      category: '',
      templateTier: 'free',
      techStack: '',
      githubUrl: '',
      liveUrl: '',
    });
    setZipUrl('');
    setImageUrls(['', '', '', '']); setImageUrlErrors([false, false, false, false]);
    setDone(false); setProgress(0);
  };

  const labelClass = "text-xs font-bold text-gray-700 dark:text-gray-500 uppercase tracking-wider mb-2 block";
  const inputClass = "w-full bg-gray-50 dark:bg-[#12121a] border border-gray-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:bg-white dark:focus:bg-[#1a1a24] transition-all hover:border-gray-300 dark:hover:border-white/20 appearance-none";
  const cardClass = "rounded-[32px] border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-8 backdrop-blur-md shadow-sm dark:shadow-none";

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-emerald-500/15">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{editId ? 'Template Updated!' : 'Template Published!'}</h2>
          <p className="text-gray-500 dark:text-gray-500 mt-2 text-sm italic">&quot;One step closer to greatness.&quot;</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => { setDone(false); if(editId) router.push('/admin/templates'); else reset(); }}
            className="px-8 py-3 rounded-2xl text-sm font-semibold text-white border border-white/10 hover:bg-white/[0.05] transition-all">
            {editId ? 'Back to Templates' : 'Upload Another'}
          </button>
          {!editId && (
            <Link href="/admin/templates" className="px-8 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20">
              View All
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-gray-500 mt-4 text-sm font-medium">Preparing template...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {editId && (
            <Link href="/admin/templates" className="p-3 rounded-2xl border border-white/10 text-gray-500 hover:text-white transition-all bg-white/5">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{editId ? 'Design Evolution' : 'Create New Masterpiece'}</h1>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">{editId ? 'Refine your template' : 'Bring a new portfolio to life'}</p>
          </div>
        </div>
        <div className="hidden md:block">
           <Zap className="w-8 h-8 text-indigo-500/20" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Identity */}
        <div className={cardClass + " relative overflow-hidden"}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none" />
          <h3 className="text-gray-900 dark:text-white font-bold mb-8 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
             Core Identity
          </h3>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Template Title *</label>
              <input value={form.title} onChange={f('title')} placeholder="Enter a descriptive title..." className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Template Description *</label>
              <textarea value={form.description} onChange={f('description')} placeholder="Tell the world about this design..." rows={4} className={inputClass + ' resize-none'} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Category *</label>
                <select value={form.category} onChange={f('category')} className={inputClass} required>
                  <option value="" disabled className="bg-white dark:bg-[#12121a]">Select category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-white dark:bg-[#12121a]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Template Tier *</label>
                <select value={form.templateTier} onChange={f('templateTier')} className={inputClass} required>
                  {TEMPLATE_TIERS.map((tier) => (
                    <option key={tier} value={tier} className="bg-white dark:bg-[#12121a]">{tier.charAt(0).toUpperCase() + tier.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Tech Stack * (comma separated)</label>
              <input value={form.techStack} onChange={f('techStack')} placeholder="React, Next.js, Tailwind..." className={inputClass} required />
            </div>
          </div>
        </div>

        {/* Connectivity */}
        <div className={cardClass}>
          <h3 className="text-gray-900 dark:text-white font-bold mb-8 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
             Connectivity
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Live Preview URL *</label>
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input value={form.liveUrl} onChange={f('liveUrl')} placeholder="https://..." className={inputClass + " pl-11"} required />
              </div>
            </div>
            <div>
              <label className={labelClass}>GitHub Repository URL *</label>
              <div className="relative">
                <FileCode className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input value={form.githubUrl} onChange={f('githubUrl')} placeholder="https://github.com/..." className={inputClass + " pl-11"} required />
              </div>
            </div>
          </div>
        </div>

        {/* Assets */}
        <div className={cardClass}>
          <div className="mb-8">
            <h3 className="text-gray-900 dark:text-white font-bold flex items-center gap-3">
               <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
               Visual Assets
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                Paste up to 4 image URLs for your template screenshots
              </div>
              {imageUrls.map((url, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 text-xs font-black shrink-0">
                      {index + 1}
                    </div>
                    <div className="relative flex-1">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        placeholder={`Image URL ${index + 1} (https://...)`}
                        className={inputClass + " pl-11 pr-10"}
                      />
                      {url && (
                        <button
                          type="button"
                          onClick={() => clearImageUrl(index)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {/* URL Preview */}
                  {url.trim() && (
                    <div className="ml-11">
                      {imageUrlErrors[index] ? (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                          <X className="w-3.5 h-3.5" /> Failed to load image — check the URL
                        </div>
                      ) : (
                        <div className="relative group rounded-2xl overflow-hidden border border-indigo-500/20 aspect-video max-w-[200px] bg-black/20">
                          <img
                            src={url}
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={() => handleImageUrlError(index)}
                          />
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-lg bg-indigo-500/80 text-[7px] font-black text-white uppercase tracking-tighter shadow-lg">URL</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {validImageUrls.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">{validImageUrls.length} image{validImageUrls.length > 1 ? 's' : ''} ready</span>
                </div>
              )}
            </div>

            {/* Existing images (shown when editing) */}
            {existingImages.length > 0 && (
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Existing Images</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((src, i) => (
                    <div key={`ex-${i}`} className="relative group rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/40">
                      <img src={src} alt="Cloud" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingImage(src)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Source Payload */}
        <div className={cardClass}>
           <h3 className="text-gray-900 dark:text-white font-bold mb-8 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
             Source Payload
          </h3>
          <div className="space-y-4">
            <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">
              Provide the direct download URL for the project source code (.zip)
            </div>
            <div className="relative">
              <FileCode className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={zipUrl}
                onChange={(e) => setZipUrl(e.target.value)}
                placeholder="https://.../source.zip"
                className={inputClass + " pl-11 pr-10"}
                required
              />
              {zipUrl && (
                <button
                  type="button"
                  onClick={() => setZipUrl('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {zipUrl && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400">Source URL provided</span>
              </div>
            )}
          </div>
        </div>

        {submitting && (
          <div className="rounded-[24px] border p-6 space-y-4 bg-indigo-500/5 border-indigo-500/20">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-indigo-400">
              <span>{editId ? 'Updating DNA...' : 'Injecting Content...'}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
               <div className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 pt-10">
          <button type="submit" disabled={submitting}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-[24px] text-sm font-bold text-white transition-all bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:opacity-90 disabled:opacity-50 shadow-xl shadow-indigo-600/20 uppercase tracking-widest">
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" />{editId ? 'Updating...' : 'Publishing...'}</>
            ) : (
              <><Upload className="w-5 h-5" />{editId ? 'Save Changes' : 'Launch Template'}</>
            )}
          </button>
          {!editId && (
            <button type="button" onClick={reset} className="px-10 py-4 rounded-[24px] text-sm font-bold text-gray-500 hover:text-white border border-white/10 hover:bg-white/5 transition-all uppercase tracking-widest">
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
