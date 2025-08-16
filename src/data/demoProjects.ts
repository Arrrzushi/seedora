export interface DemoProject {
  id: string;
  title: string;
  description: string;
  founder_name: string;
  company_name: string;
  category: string;
  price: number;
  likes_count: number;
  views_count: number;
  purchase_count: number;
  is_featured: boolean;
  demo_link?: string;
  presentation_video?: string;
  thumbnail_url: string;
  project_type: string;
  business_model: string;
  developers: string;
  created_at: string;
  status: string;
  shares_available: number;
  total_shares: number;
}

export const demoProjects: DemoProject[] = [
  {
    id: 'demo-1',
    title: 'AI-Powered Analytics Platform',
    description: 'Revolutionary AI platform that transforms raw data into actionable insights using advanced machine learning algorithms. Features real-time processing, predictive analytics, and intuitive dashboards for businesses of all sizes.',
    founder_name: 'Sarah Johnson',
    company_name: 'DataMind AI',
    category: 'AI/ML',
    price: 25,
    likes_count: 156,
    views_count: 2340,
    purchase_count: 3,
    is_featured: true,
    demo_link: 'https://datamind-demo.vercel.app',
    presentation_video: 'https://youtube.com/watch?v=demo1',
    thumbnail_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    project_type: 'Web Application',
    business_model: 'SaaS (Software as a Service)',
    developers: 'Sarah Johnson (Lead AI Engineer), Mike Chen (Backend Developer), Lisa Wang (Frontend Developer)',
    created_at: '2024-01-15T10:30:00Z',
    status: 'active',
    shares_available: 150,
    total_shares: 1000
  },
  {
    id: 'demo-2',
    title: 'Blockchain Security Protocol',
    description: 'Next-generation security protocol for blockchain applications featuring quantum-resistant encryption, multi-signature validation, and automated threat detection. Designed for enterprise-grade security requirements.',
    founder_name: 'James Park',
    company_name: 'SecureChain Labs',
    category: 'Blockchain',
    price: 45,
    likes_count: 89,
    views_count: 1560,
    purchase_count: 1,
    is_featured: true,
    demo_link: 'https://securechain-demo.netlify.app',
    presentation_video: 'https://vimeo.com/demo2',
    thumbnail_url: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    project_type: 'Blockchain Protocol',
    business_model: 'Licensing',
    developers: 'James Park (Blockchain Architect), Alex Rodriguez (Security Engineer), Emma Thompson (Smart Contract Developer)',
    created_at: '2024-01-20T14:15:00Z',
    status: 'active',
    shares_available: 200,
    total_shares: 1000
  },
  {
    id: 'demo-3',
    title: 'FinTech Payment Solution',
    description: 'Revolutionary payment processing system that reduces transaction fees by 60% while providing instant settlements. Features fraud detection, multi-currency support, and seamless API integration.',
    founder_name: 'Emma Davis',
    company_name: 'PayFlow Technologies',
    category: 'Fintech',
    price: 35,
    likes_count: 124,
    views_count: 1890,
    purchase_count: 2,
    is_featured: false,
    demo_link: 'https://payflow-demo.herokuapp.com',
    thumbnail_url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    project_type: 'API/Backend Service',
    business_model: 'Transaction Fees',
    developers: 'Emma Davis (FinTech Engineer), David Kim (Payment Systems), Rachel Green (Compliance Officer)',
    created_at: '2024-01-25T09:45:00Z',
    status: 'active',
    shares_available: 300,
    total_shares: 1000
  },
  {
    id: 'demo-4',
    title: 'Healthcare Data Platform',
    description: 'HIPAA-compliant healthcare data management platform with AI-powered diagnostics, patient record management, and telemedicine integration. Streamlines healthcare workflows while ensuring data privacy.',
    founder_name: 'Dr. Michael Chen',
    company_name: 'HealthTech Solutions',
    category: 'Healthtech',
    price: 40,
    likes_count: 78,
    views_count: 1120,
    purchase_count: 1,
    is_featured: false,
    demo_link: 'https://healthtech-demo.vercel.app',
    presentation_video: 'https://youtube.com/watch?v=demo4',
    thumbnail_url: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    project_type: 'Web Application',
    business_model: 'SaaS (Software as a Service)',
    developers: 'Dr. Michael Chen (Medical Informatics), Jennifer Liu (Healthcare Software Engineer), Tom Wilson (Data Security Specialist)',
    created_at: '2024-02-01T11:20:00Z',
    status: 'active',
    shares_available: 180,
    total_shares: 1000
  },
  {
    id: 'demo-5',
    title: 'EdTech Learning Assistant',
    description: 'AI-powered personalized learning platform that adapts to individual student needs. Features interactive content, progress tracking, and gamified learning experiences for K-12 education.',
    founder_name: 'Lisa Rodriguez',
    company_name: 'EduSmart AI',
    category: 'Edtech',
    price: 20,
    likes_count: 145,
    views_count: 2100,
    purchase_count: 4,
    is_featured: true,
    demo_link: 'https://edusmart-demo.netlify.app',
    thumbnail_url: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    project_type: 'Mobile Application',
    business_model: 'Freemium',
    developers: 'Lisa Rodriguez (EdTech Specialist), Carlos Martinez (Mobile Developer), Amy Zhang (UX Designer)',
    created_at: '2024-02-05T16:30:00Z',
    status: 'active',
    shares_available: 250,
    total_shares: 1000
  },
  {
    id: 'demo-6',
    title: 'Sustainable Energy Tracker',
    description: 'IoT-enabled platform for monitoring and optimizing renewable energy consumption. Features real-time analytics, carbon footprint tracking, and automated energy management for smart buildings.',
    founder_name: 'Robert Green',
    company_name: 'GreenTech Innovations',
    category: 'IoT',
    price: 30,
    likes_count: 67,
    views_count: 890,
    purchase_count: 2,
    is_featured: false,
    demo_link: 'https://greentech-demo.vercel.app',
    presentation_video: 'https://vimeo.com/demo6',
    thumbnail_url: 'https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    project_type: 'IoT',
    business_model: 'SaaS (Software as a Service)',
    developers: 'Robert Green (IoT Engineer), Maria Santos (Environmental Data Scientist), Kevin Lee (Hardware Specialist)',
    created_at: '2024-02-10T13:15:00Z',
    status: 'active',
    shares_available: 320,
    total_shares: 1000
  },
  {
    id: 'demo-7',
    title: 'Cybersecurity Shield Pro',
    description: 'Advanced cybersecurity solution with AI-powered threat detection, real-time monitoring, and automated incident response. Protects against zero-day attacks and advanced persistent threats.',
    founder_name: 'Alex Thompson',
    company_name: 'CyberGuard Systems',
    category: 'Cybersecurity',
    price: 50,
    likes_count: 92,
    views_count: 1450,
    purchase_count: 1,
    is_featured: true,
    demo_link: 'https://cyberguard-demo.herokuapp.com',
    thumbnail_url: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    project_type: 'Desktop Software',
    business_model: 'Subscription',
    developers: 'Alex Thompson (Security Architect), Nina Patel (Threat Intelligence), Jason Wu (Network Security)',
    created_at: '2024-02-15T08:45:00Z',
    status: 'active',
    shares_available: 100,
    total_shares: 1000
  },
  {
    id: 'demo-8',
    title: 'Gaming Metaverse Platform',
    description: 'Immersive metaverse gaming platform with NFT integration, virtual real estate, and cross-platform compatibility. Features social interactions, virtual economy, and user-generated content.',
    founder_name: 'Tyler Johnson',
    company_name: 'MetaGame Studios',
    category: 'Gaming',
    price: 75,
    likes_count: 234,
    views_count: 3200,
    purchase_count: 2,
    is_featured: true,
    demo_link: 'https://metagame-demo.vercel.app',
    presentation_video: 'https://youtube.com/watch?v=demo8',
    thumbnail_url: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    project_type: 'Web Application',
    business_model: 'Marketplace Commission',
    developers: 'Tyler Johnson (Game Director), Sophie Chen (3D Artist), Mark Davis (Blockchain Developer), Luna Kim (Game Designer)',
    created_at: '2024-02-20T12:00:00Z',
    status: 'active',
    shares_available: 80,
    total_shares: 1000
  },
  {
    id: 'demo-9',
    title: 'Social Commerce Hub',
    description: 'Next-generation social commerce platform that combines social media engagement with seamless shopping experiences. Features influencer partnerships, live shopping, and AI-powered recommendations.',
    founder_name: 'Jessica Wang',
    company_name: 'SocialShop Inc',
    category: 'E-commerce',
    price: 28,
    likes_count: 178,
    views_count: 2560,
    purchase_count: 3,
    is_featured: false,
    demo_link: 'https://socialshop-demo.netlify.app',
    thumbnail_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    project_type: 'Web Application',
    business_model: 'Marketplace Commission',
    developers: 'Jessica Wang (Product Manager), Ryan Lee (Full-stack Developer), Priya Sharma (Social Media Integration)',
    created_at: '2024-02-25T15:30:00Z',
    status: 'active',
    shares_available: 220,
    total_shares: 1000
  },
  {
    id: 'demo-10',
    title: 'Productivity AI Assistant',
    description: 'Intelligent productivity assistant that automates workflows, manages schedules, and provides smart insights. Features natural language processing, calendar integration, and task automation.',
    founder_name: 'Daniel Kim',
    company_name: 'ProductiveAI',
    category: 'Productivity',
    price: 15,
    likes_count: 203,
    views_count: 2890,
    purchase_count: 5,
    is_featured: false,
    demo_link: 'https://productiveai-demo.vercel.app',
    presentation_video: 'https://vimeo.com/demo10',
    thumbnail_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    project_type: 'Web Application',
    business_model: 'Freemium',
    developers: 'Daniel Kim (AI Engineer), Grace Liu (NLP Specialist), Sam Rodriguez (Frontend Developer)',
    created_at: '2024-03-01T10:15:00Z',
    status: 'active',
    shares_available: 400,
    total_shares: 1000
  }
];

// Mock developer profiles
export interface DeveloperProfile {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar_url: string;
  company: string;
  location: string;
  skills: string[];
  projects: DemoProject[];
  total_likes: number;
  total_views: number;
  joined_date: string;
  verified: boolean;
}

export const developerProfiles: DeveloperProfile[] = [
  {
    id: 'dev-1',
    name: 'Sarah Johnson',
    username: 'sarahj_ai',
    bio: 'AI/ML Engineer passionate about transforming data into actionable insights. 5+ years building scalable AI solutions.',
    avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    company: 'DataMind AI',
    location: 'San Francisco, CA',
    skills: ['Machine Learning', 'Python', 'TensorFlow', 'Data Analytics', 'React'],
    projects: [demoProjects[0]],
    total_likes: 156,
    total_views: 2340,
    joined_date: '2023-06-15',
    verified: true
  },
  {
    id: 'dev-2',
    name: 'James Park',
    username: 'jpark_blockchain',
    bio: 'Blockchain architect specializing in security protocols and smart contracts. Building the future of decentralized systems.',
    avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    company: 'SecureChain Labs',
    location: 'Austin, TX',
    skills: ['Blockchain', 'Solidity', 'Cryptography', 'Security', 'Node.js'],
    projects: [demoProjects[1]],
    total_likes: 89,
    total_views: 1560,
    joined_date: '2023-08-20',
    verified: true
  },
  {
    id: 'dev-3',
    name: 'Emma Davis',
    username: 'emma_fintech',
    bio: 'FinTech innovator revolutionizing payment systems. Former Goldman Sachs engineer turned entrepreneur.',
    avatar_url: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    company: 'PayFlow Technologies',
    location: 'New York, NY',
    skills: ['FinTech', 'Payment Systems', 'API Development', 'Security', 'Java'],
    projects: [demoProjects[2]],
    total_likes: 124,
    total_views: 1890,
    joined_date: '2023-09-10',
    verified: false
  },
  {
    id: 'dev-4',
    name: 'Dr. Michael Chen',
    username: 'drchen_health',
    bio: 'Medical doctor turned software engineer. Building HIPAA-compliant healthcare solutions that save lives.',
    avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    company: 'HealthTech Solutions',
    location: 'Boston, MA',
    skills: ['Healthcare IT', 'HIPAA Compliance', 'Medical Informatics', 'React', 'Python'],
    projects: [demoProjects[3]],
    total_likes: 78,
    total_views: 1120,
    joined_date: '2023-07-05',
    verified: true
  },
  {
    id: 'dev-5',
    name: 'Lisa Rodriguez',
    username: 'lisa_edtech',
    bio: 'EdTech specialist creating personalized learning experiences. Former teacher with a passion for technology.',
    avatar_url: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    company: 'EduSmart AI',
    location: 'Seattle, WA',
    skills: ['EdTech', 'Mobile Development', 'UX Design', 'React Native', 'AI'],
    projects: [demoProjects[4]],
    total_likes: 145,
    total_views: 2100,
    joined_date: '2023-05-12',
    verified: false
  }
];

// Helper function to get trending projects (most liked)
export const getTrendingProjects = (limit: number = 5) => {
  return [...demoProjects]
    .sort((a, b) => b.likes_count - a.likes_count)
    .slice(0, limit);
};

// Helper function to get featured projects
export const getFeaturedProjects = () => {
  return demoProjects.filter(project => project.is_featured);
};

// Helper function to get projects by category
export const getProjectsByCategory = (category: string) => {
  if (category === 'all') return demoProjects;
  return demoProjects.filter(project => project.category === category);
};

// Helper function to search projects
export const searchProjects = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return demoProjects.filter(project => 
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.description.toLowerCase().includes(lowercaseQuery) ||
    project.founder_name.toLowerCase().includes(lowercaseQuery) ||
    project.category.toLowerCase().includes(lowercaseQuery) ||
    project.company_name.toLowerCase().includes(lowercaseQuery)
  );
};

// Helper function to search developers
export const searchDevelopers = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return developerProfiles.filter(dev => 
    dev.name.toLowerCase().includes(lowercaseQuery) ||
    dev.username.toLowerCase().includes(lowercaseQuery) ||
    dev.bio.toLowerCase().includes(lowercaseQuery) ||
    dev.company.toLowerCase().includes(lowercaseQuery) ||
    dev.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
  );
};

// Helper function to get developer by ID
export const getDeveloperById = (id: string) => {
  return developerProfiles.find(dev => dev.id === id);
};

// Helper function to get developer by project
export const getDeveloperByProject = (projectId: string) => {
  const project = demoProjects.find(p => p.id === projectId);
  if (!project) return null;
  
  return developerProfiles.find(dev => 
    dev.projects.some(p => p.id === projectId)
  );
};