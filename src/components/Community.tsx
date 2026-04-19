import { Heart, Users, Sparkles } from 'lucide-react';

export default function Community() {
  return (
    <section className="bg-transparent py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="relative bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl border border-white/10 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative px-8 py-16 sm:px-12 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-gray-300">Our Mission</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
              Empowering Every Developer to Land Their Dream Job
            </h2>

            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              We believe that talent should never be limited by technical barriers. Portify Studio was built by developers who understand the struggle of showcasing skills effectively. Join thousands of developers who have transformed their career trajectory with a stunning portfolio.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">10,000+</div>
                  <div className="text-sm text-gray-400">Community Members</div>
                </div>
              </div>

              <div className="w-px h-12 bg-white/10 hidden sm:block"></div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">Free Forever</div>
                  <div className="text-sm text-gray-400">No Hidden Costs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
