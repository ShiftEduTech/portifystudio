import { LayoutGrid as Layout, Users, Globe, Heart } from 'lucide-react';

const stats = [
  {
    icon: Layout,
    value: '50+',
    label: 'Premium Templates',
  },
  {
    icon: Users,
    value: '10,000+',
    label: 'Active Users',
  },
  {
    icon: Globe,
    value: '5,000+',
    label: 'Portfolios Launched',
  },
  {
    icon: Heart,
    value: '98%',
    label: 'User Satisfaction',
  },
];

export default function SocialProof() {
  return (
    <section className="bg-transparent py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl border border-white/10 p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-4">
                  <stat.icon className="w-7 h-7 text-blue-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
