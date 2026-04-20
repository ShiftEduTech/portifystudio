import { notFound } from 'next/navigation';
import { getTemplateById } from '@/data/templates';
import TemplateGallery from '@/components/templates/TemplateGallery';
import TemplateActions from '@/components/templates/TemplateActions';
import { ArrowLeft, CheckCircle2, Layers, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Metadata } from 'next';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const template = await getTemplateById(params.id);
  if (!template) return { title: 'Template Not Found | Portify Studio' };

  return {
    title: `${template.title} | Portfolio Template for Developers | Portify Studio`,
    description: template.description || `Build your professional portfolio with the ${template.title} template. Perfect for ${template.category} developers and designers.`,
    openGraph: {
      title: `${template.title} - Professional ${template.category} Portfolio Template`,
      description: template.description,
      images: [template.thumbnails?.[0] || template.images?.[0] || ''],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: template.title,
      description: template.description,
      images: [template.thumbnails?.[0] || template.images?.[0] || ''],
    },
  };
}

export default async function TemplateDetailsPage({ params }: PageProps) {
  const template = await getTemplateById(params.id);

  if (!template) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": template.title,
    "description": template.description,
    "operatingSystem": "Web Browser",
    "applicationCategory": "DeveloperPortfolioTemplate",
    "offers": {
      "@type": "Offer",
      "price": template.accessLevel === 'free' ? "0.00" : "15.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": Math.max(template.downloadCount || 0, 12)
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] pt-32 pb-20 relative overflow-hidden">
      {/* SEO Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <Link 
          href="/templates" 
          className="group inline-flex items-center gap-2 text-gray-500 hover:text-white mb-10 transition-all font-medium text-sm"
        >
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to templates
        </Link>

        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              {template.category ?? template.role}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
              template.accessLevel === 'pro' 
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' 
                : template.accessLevel === 'premium'
                ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            }`}>
              {template.accessLevel} Tier
            </div>
            {template.difficulty && (
               <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-bold">
                {template.difficulty}
             </div>
            )}
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            {template.title}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
            {template.longDescription || template.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Main Content: Gallery & Features */}
          <div className="lg:col-span-8 space-y-12">
            <div className="rounded-[32px] overflow-hidden border border-white/10 bg-white/[0.02] p-2 backdrop-blur-sm group shadow-2xl shadow-indigo-500/5">
              <TemplateGallery images={template.images?.length ? template.images : template.thumbnails} />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-8 rounded-[32px] border border-white/10 bg-white/[0.02] backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  Key Features
                </h3>
                <ul className="space-y-4">
                  {(template.features?.length ? template.features : ['Fully Responsive', 'SEO Optimized', 'Clean Code', 'Modern UI']).map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_10px_#6366f1]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 rounded-[32px] border border-white/10 bg-white/[0.02] backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(template.techStack?.length ? template.techStack : template.tags).map((tech, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-medium hover:border-indigo-500/30 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Stats & Actions */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
            <div className="p-8 rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl relative overflow-hidden group shadow-2xl shadow-indigo-500/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl pointer-events-none" />
              
              <div className="mb-8">
                  <h3 className="text-xl font-bold text-white tracking-tight">Get Started</h3>
                  <p className="text-xs text-gray-500 mt-1">Setup your project in seconds</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 group/stat hover:border-indigo-500/30 transition-colors">
                  <span className="text-sm text-gray-400">Total Downloads</span>
                  <span className="text-sm font-bold text-white tabular-nums">{(template.downloadCount ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 group/stat hover:border-indigo-500/30 transition-colors">
                  <span className="text-sm text-gray-400">Last Updated</span>
                  <span className="text-sm font-bold text-white">
                    {template.updatedAt?.seconds
                      ? new Date(template.updatedAt.seconds * 1000).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                      : 'Recently'}
                  </span>
                </div>
              </div>

              <TemplateActions template={template} />
            </div>

            <div className="p-6 rounded-[24px] border border-white/10 bg-indigo-500/5 backdrop-blur-md">
              <div className="flex items-center gap-3 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4" />
                Guaranteed Quality
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                All templates on Portify Studio are manually reviewed for code quality, responsiveness, and performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
