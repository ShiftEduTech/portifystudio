import VideoCard from '@/components/VideoCard';

const videos = [
  {
    videoId: 'dQw4w9WgXcQ',
    title: 'Getting Started with Portify Studio',
    description: 'Learn the basics of creating your first portfolio with Portify Studio. A quick introduction to our platform.',
  },
  {
    videoId: 'dQw4w9WgXcQ',
    title: 'Customizing Your Template',
    description: 'Discover how to personalize your template with your own projects, skills, and experience.',
  },
  {
    videoId: 'dQw4w9WgXcQ',
    title: 'Adding Projects & Case Studies',
    description: 'Learn how to effectively showcase your projects and create compelling case studies.',
  },
  {
    videoId: 'dQw4w9WgXcQ',
    title: 'Publishing & Sharing Your Portfolio',
    description: 'Step-by-step guide to publishing your portfolio and sharing it with recruiters and employers.',
  },
];

export default function DeveloperGuidePage() {
  return (
    <section className="min-h-screen bg-transparent py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
            Developer Guide
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Learn how to make the most of Portify Studio and create a portfolio that stands out
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <VideoCard
              key={index}
              videoId={video.videoId}
              title={video.title}
              description={video.description}
            />
          ))}
        </div>

        <div className="mt-20 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Pro Tips</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">•</span>
                Use high-quality images and project previews to grab attention
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">•</span>
                Write clear, concise descriptions for each project
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">•</span>
                Keep your portfolio updated with recent work
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">•</span>
                Include links to your GitHub, LinkedIn, and other relevant profiles
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">•</span>
                Make sure your portfolio is mobile-friendly and fast-loading
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
