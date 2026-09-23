import { CreationExperience, TrendingItem, FunExperience, IdeaItem } from '../types';

export const CREATION_EXPERIENCES: CreationExperience[] = [
  {
    id: 'ai-photo',
    title: 'AI Photo',
    tagline: 'Transform your photos',
    description: 'Enhance portraits, adjust lighting, clean backgrounds, and restore image quality with one click.',
    iconName: 'Sparkles',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    route: '/ai-photo',
    badge: 'Popular',
    features: ['Studio Retouch', 'Background Replace', 'Super Resolution']
  },
  {
    id: 'ai-image',
    title: 'AI Image',
    tagline: 'Create images from your ideas',
    description: 'Type a descriptive prompt and generate rich, original artwork, concepts, and high-fidelity visuals.',
    iconName: 'Palette',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    route: '/ai-image',
    badge: 'Creative',
    features: ['Concept Art', 'Photorealistic', 'Digital Illustration']
  },
  {
    id: 'ai-video',
    title: 'AI Video',
    tagline: 'Bring images to life',
    description: 'Turn still photography into fluid motion sequences, cinematic depth zooms, and living loops.',
    iconName: 'Clapperboard',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80',
    route: '/ai-video',
    badge: 'Motion',
    features: ['Parallax Motion', 'Dynamic Loop', 'Cinematic Pan']
  },
  {
    id: 'fun-creative',
    title: 'Fun & Creative',
    tagline: 'Try something unexpected',
    description: 'Reimagine yourself as iconic characters, retro album covers, film posters, and fantasy avatars.',
    iconName: 'Wand2',
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=900&q=80',
    route: '/fun',
    badge: 'Playful',
    features: ['Movie Posters', '3D Characters', 'Time Travel']
  }
];

export const TRENDING_CREATIONS: TrendingItem[] = [
  {
    id: 'trend-1',
    title: 'Portrait Transformation',
    category: 'Enhancement',
    transformationType: 'Studio Lighting & Fine Detail',
    beforeImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    promptDescription: 'High-end editorial studio key lighting with natural skin texture polish',
    route: '/ai-photo'
  },
  {
    id: 'trend-2',
    title: 'Photo to Cartoon',
    category: 'Stylization',
    transformationType: '3D Pixar-Style Animation',
    beforeImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    promptDescription: 'Vibrant 3D animated character render with expressive eyes and warm backlight',
    route: '/fun'
  },
  {
    id: 'trend-3',
    title: 'Image Style Transformation',
    category: 'Artistic',
    transformationType: 'Impressionist Oil & Watercolor',
    beforeImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    promptDescription: 'Rich tactile brushstrokes, dynamic impasto layers, and vibrant palette knife accents',
    route: '/ai-image'
  },
  {
    id: 'trend-4',
    title: 'Landscape Transformation',
    category: 'Atmosphere',
    transformationType: 'Cinematic Golden Hour & Mist',
    beforeImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    promptDescription: 'Volumetric god rays, ethereal mountain mist, and warm twilight reflections',
    route: '/ai-photo'
  },
  {
    id: 'trend-5',
    title: 'Photo Animation',
    category: 'Motion',
    transformationType: 'Cinematic 2.5D Camera Parallax',
    beforeImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    promptDescription: 'Subtle atmospheric snowfall, gentle wind sway, and gradual focal push-in',
    route: '/ai-video'
  },
  {
    id: 'trend-6',
    title: 'Creative Character',
    category: 'Avatar',
    transformationType: 'Cyberpunk Neon Cyber Avatar',
    beforeImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    promptDescription: 'Bioluminescent synthwave neon highlights, iridescent jacket, and futuristic reflections',
    route: '/fun'
  }
];

export const FUN_EXPERIENCES: FunExperience[] = [
  {
    id: 'fun-1',
    title: 'Turn Me Into a Character',
    description: 'Transform your portrait into an iconic animated character, superhero, or fantasy adventurer.',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=700&q=80',
    tag: 'Animated',
    route: '/fun'
  },
  {
    id: 'fun-2',
    title: 'Make Me a Movie Poster',
    description: 'Place your face in high-drama blockbuster movie titles with authentic typography and cinema grading.',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=80',
    tag: 'Cinema',
    route: '/fun'
  },
  {
    id: 'fun-3',
    title: 'What Would I Look Like As…?',
    description: 'Explore historical eras, cybernetic futures, royal aristocracy, or 1990s retro aesthetic.',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=700&q=80',
    tag: 'Time Travel',
    route: '/fun'
  },
  {
    id: 'fun-4',
    title: 'Create a Creative Profile Picture',
    description: 'Stand out on social media and portfolio sites with designer avatars, neon borders, and clean silhouettes.',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=700&q=80',
    tag: 'Avatars',
    route: '/fun'
  }
];

export const SIMPLE_IDEAS: IdeaItem[] = [
  {
    id: 'idea-1',
    title: 'AI Photo Ideas',
    description: 'How to clean messy backgrounds, correct backlit snapshots, and achieve runway magazine skin tones.',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
    count: '12 Guides',
    route: '/ideas'
  },
  {
    id: 'idea-2',
    title: 'Creative Profile Picture Ideas',
    description: 'Fresh concepts for modern avatars, minimalist flat vector styles, and professional lighting aesthetics.',
    category: 'Social Branding',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    count: '8 Guides',
    route: '/ideas'
  },
  {
    id: 'idea-3',
    title: 'Photo-to-Video Ideas',
    description: 'Creative ways to transform travel photos into cinematic b-roll memories and animated social stories.',
    category: 'Motion Design',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=600&q=80',
    count: '10 Guides',
    route: '/ideas'
  },
  {
    id: 'idea-4',
    title: 'AI Image Ideas',
    description: 'Prompt recipes for fantasy concept architecture, vibrant vaporwave landscapes, and abstract product backdrops.',
    category: 'Prompt Recipes',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    count: '15 Guides',
    route: '/ideas'
  }
];

export const HERO_BEFORE_AFTER = {
  title: 'Portrait Studio Lighting & Clarity',
  beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80&sat=-40&con=10', // flatter lighting
  afterImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=90', // enhanced vibrant editorial
  labelBefore: 'Original Snapshot',
  labelAfter: 'Visual Lab Enhanced'
};
