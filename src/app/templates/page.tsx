import { getAllTemplates } from '@/data/templates';
import TemplateCard from '@/components/TemplateCard';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
  const templates = await getAllTemplates();

  return (
    <section className="min-h-screen bg-transparent py-20 sm:py-32 relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6 tracking-tight">
            Premium Templates
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Kickstart your portfolio with our industry-specific, highly optimized templates. Designed for conversion and impact.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
