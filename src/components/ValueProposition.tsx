import { Zap, Target, Trophy } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Go from zero to published portfolio in under 10 minutes. No coding required, just pick a template and customize.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: Target,
    title: 'Industry-Focused Templates',
    description: '50+ templates designed for specific tech stacks and roles. Java, Python, MERN, DevOps, Freshers, and Experienced.',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    icon: Trophy,
    title: 'Career-Driven Design',
    description: 'Every template is built to impress recruiters and hiring managers. Showcase your skills, projects, and achievements effectively.',
    gradient: 'from-blue-500/20 to-purple-500/20',
  },
];

export default function ValueProposition() {
  return (
    <section className="bg-transparent py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Developers Choose Portify Studio
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            The fastest way to create a professional portfolio that lands interviews
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-white/5 to-white/0 p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}></div>

              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-blue-400" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
