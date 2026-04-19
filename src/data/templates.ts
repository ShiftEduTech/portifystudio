import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export type AccessLevel = 'free' | 'premium' | 'pro';

export interface Template {
  id: string;
  title: string;
  role: string;
  description: string;
  longDescription: string;
  thumbnails: string[];
  images?: string[];
  tags: string[];
  techStack?: string[];
  features?: string[];
  templateTier?: AccessLevel;
  accessLevel: AccessLevel;
  category?: string;
  downloadCount?: number;
  updatedAt?: any;
  liveLink: string;
  zipUrl?: string;
  gitRepo?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Keeping the hardcoded array to serve as fallback/initial seed data 
export const templatesData: Template[] = [
  {
    id: 'mern-stack-pro',
    title: 'MERN Stack Developer Pro',
    role: 'Full Stack Engineer',
    description: 'A comprehensive portfolio for MERN stack developers showcasing projects, skills, and experience with a dark, modern UI.',
    longDescription: 'This template is designed specifically for MERN (MongoDB, Express.js, React, Node.js) developers. It features dedicated sections for full-stack architecture diagrams, API documentation links, and interactive project showcases. Built with performance and accessibility in mind, it guarantees a high Lighthouse score.',
    thumbnails: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'
    ],
    tags: ['React', 'Node.js', 'MongoDB', 'TailwindCSS', 'Framer Motion'],
    accessLevel: 'free',
    liveLink: 'https://demo-mern-portfolio.vercel.app',
    gitRepo: 'https://github.com/portifystudio/template-mern-pro',
    difficulty: 'Intermediate',
  },
  {
    id: 'java-backend-enterprise',
    title: 'Java Enterprise Architect',
    role: 'Backend/Java Developer',
    description: 'Minimalist, powerful portfolio for Java developers focused on backend systems, microservices, and system design.',
    longDescription: 'Designed for backend engineers, this template emphasizes system architecture and technical depth over flashy frontend animations. Includes built-in support for displaying Swagger docs, system design diagrams, and cloud infrastructure experience.',
    thumbnails: [
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=1200'
    ],
    tags: ['Java', 'Spring Boot', 'Microservices', 'Docker', 'AWS'],
    accessLevel: 'premium',
    liveLink: 'https://demo-java-portfolio.vercel.app',
    gitRepo: 'https://github.com/portifystudio/template-java-enterprise',
    difficulty: 'Advanced',
  },
  {
    id: 'frontend-creative',
    title: 'Frontend Creative Portfolio',
    role: 'Frontend Developer',
    description: 'A visually stunning template with complex micro-interactions, 3D elements, and smooth page transitions.',
    longDescription: 'Perfect for frontend developers looking to wow recruiters with their UI/UX skills. Features Three.js integrations, advanced Framer Motion page transitions, and a custom cursor. This is a high-impact template designed to leave a lasting impression.',
    thumbnails: [
      'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200'
    ],
    tags: ['Next.js', 'Three.js', 'Framer Motion', 'TailwindCSS'],
    accessLevel: 'premium',
    liveLink: 'https://demo-frontend-creative.vercel.app',
    gitRepo: 'https://github.com/portifystudio/template-frontend-creative',
    difficulty: 'Advanced',
  },
  {
    id: 'devops-dashboard',
    title: 'DevOps & Cloud Engineer',
    role: 'DevOps Engineer',
    description: 'A terminal-inspired, highly technical portfolio template for DevOps, Cloud, and SRE professionals.',
    longDescription: 'This template simulates a professional development environment. It includes a built-in terminal emulator for demonstrating bash scripting skills, architecture mapping components, and interactive CI/CD pipeline visualizations.',
    thumbnails: [
      'https://images.unsplash.com/photo-1618401471353-b98a580d414e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200'
    ],
    tags: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD'],
    accessLevel: 'free',
    liveLink: 'https://demo-devops-portfolio.vercel.app',
    gitRepo: 'https://github.com/portifystudio/template-devops',
    difficulty: 'Beginner',
  }
];

export async function getAllTemplates(): Promise<Template[]> {
  try {
    const templatesRef = collection(db, 'templates');
    const snapshot = await getDocs(templatesRef);
    
    // If the database is empty (not seeded yet), fallback to hardcoded mock data so the app doesn't break
    if (snapshot.empty) {
      return templatesData.map(normalizeTemplate);
    }

    return snapshot.docs.map((item) => normalizeTemplate({ id: item.id, ...item.data() } as Record<string, any>));
  } catch (error) {
    console.error('Error fetching templates from Firestore:', error);
    return templatesData.map(normalizeTemplate); // Fallback in case of permissions error
  }
}

export async function getTemplateById(id: string): Promise<Template | undefined> {
  try {
    const templateRef = doc(db, 'templates', id);
    const docSnap = await getDoc(templateRef);
    
    if (docSnap.exists()) {
      return normalizeTemplate({ id: docSnap.id, ...docSnap.data() } as Record<string, any>);
    }
  } catch (error) {
    console.error(`Error fetching template ${id}:`, error);
  }

  // Fallback if not found in db
  return templatesData.find(t => t.id === id);
}

function normalizeTemplate(raw: Record<string, any>): Template {
  const accessLevel = (raw.templateTier ?? raw.accessLevel ?? 'free') as AccessLevel;
  const techStack = Array.isArray(raw.techStack) ? raw.techStack : [];
  const features = Array.isArray(raw.features) ? raw.features : [];
  const tags = Array.isArray(raw.tags) ? raw.tags : [...techStack, ...features].filter(Boolean);

  return {
    id: String(raw.id ?? ''),
    title: String(raw.title ?? 'Untitled Template'),
    role: String(raw.role ?? raw.category ?? 'Developer'),
    description: String(raw.description ?? ''),
    longDescription: String(raw.longDescription ?? raw.description ?? ''),
    thumbnails: Array.isArray(raw.thumbnails) ? raw.thumbnails : Array.isArray(raw.images) ? raw.images : [],
    images: Array.isArray(raw.images) ? raw.images : Array.isArray(raw.thumbnails) ? raw.thumbnails : [],
    tags,
    techStack,
    features,
    templateTier: accessLevel,
    accessLevel,
    category: raw.category ? String(raw.category) : undefined,
    downloadCount: typeof raw.downloadCount === 'number' ? raw.downloadCount : 0,
    updatedAt: (raw.updatedAt || raw.createdAt) 
      ? { 
          seconds: (raw.updatedAt || raw.createdAt).seconds, 
          nanoseconds: (raw.updatedAt || raw.createdAt).nanoseconds || 0 
        } 
      : undefined,
    liveLink: String(raw.liveLink ?? raw.liveUrl ?? '#'),
    zipUrl: raw.zipUrl ? String(raw.zipUrl) : undefined,
    gitRepo: raw.gitRepo ?? raw.githubUrl ?? undefined,
    difficulty: (raw.difficulty ?? 'Intermediate') as Template['difficulty'],
  };
}
