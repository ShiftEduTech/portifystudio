export interface VideoCardProps {
  videoId: string;
  title: string;
  description: string;
}

export default function VideoCard({ videoId, title, description }: VideoCardProps) {
  return (
    <div className="group relative bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden hover:scale-105">
      <div className="relative pt-[56.25%]">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title={title}
          allowFullScreen
        />
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
