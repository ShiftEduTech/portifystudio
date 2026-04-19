import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="bg-transparent py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>

          <div className="relative px-8 py-16 sm:px-12 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-8">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">Start Building Now</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
              Your Dream Job is One Portfolio Away
            </h2>

            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of developers who landed their dream roles with a professional portfolio.
              Start free today — no credit card required.
            </p>

            <Link href="/templates" className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              Get Started for Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="mt-6 text-sm text-white/70">
              No credit card required • 50+ templates • Free forever
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
