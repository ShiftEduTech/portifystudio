import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import ValueProposition from '@/components/ValueProposition';
import TemplateShowcase from '@/components/TemplateShowcase';
import HowItWorks from '@/components/HowItWorks';
import SocialProof from '@/components/SocialProof';
import Differentiation from '@/components/Differentiation';
import Community from '@/components/Community';
import FinalCTA from '@/components/FinalCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ValueProposition />
      <TemplateShowcase />
      <HowItWorks />
      <SocialProof />
      <Differentiation />
      <Community />
      <FinalCTA />
    </>
  );
}
