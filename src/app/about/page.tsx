import { Heart, Target, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-transparent py-20 sm:py-32">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
            About Portify Studio
          </h1>
          <p className="text-xl text-gray-400">
            Empowering every developer to build a strong career presence
          </p>
        </div>

        <div className="space-y-16">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              Portify Studio was born from a simple realization: talented developers were struggling to showcase their skills effectively. In a competitive job market, a strong portfolio can be the difference between landing your dream role and being overlooked.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We created Portify Studio to eliminate the barriers—no coding required, no expensive designers, no hosting headaches. Just beautiful, professional portfolios in minutes.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10 rounded-2xl p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              To empower every developer, designer, and technical professional with the tools they need to build a stunning portfolio and land their dream job. We believe that talent should never be limited by technical barriers or lack of resources.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-4">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Our Vision</h3>
              <p className="text-gray-400">
                To become the go-to platform for developers to showcase their skills and build their careers globally.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-4">
                <Heart className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Our Values</h3>
              <p className="text-gray-400">
                We believe in simplicity, accessibility, and empowerment. Making portfolio building free and easy for everyone.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-4">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Our Community</h3>
              <p className="text-gray-400">
                Join thousands of developers who have launched their careers with Portify Studio. You're in good company.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Built by Shift EduTech</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Portify Studio is an educational initiative by Shift EduTech, dedicated to helping students and professionals build their careers. We're committed to providing free tools and resources that empower everyone to succeed in the tech industry.
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Ready to Build Your Portfolio?</h2>
            <a
              href="/templates"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
            >
              Explore Templates
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
