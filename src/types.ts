export type RoutePath = 
  | '/'
  | '/create'
  | '/ai-photo'
  | '/ai-image'
  | '/ai-video'
  | '/fun'
  | '/ideas'
  | '/blog'
  | '/about'
  | '/contact'
  | '/privacy'
  | '/terms'
  | '/faq'
  | '/404';

export interface CreationExperience {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  thumbnail: string;
  route: RoutePath;
  badge?: string;
  features: string[];
}

export interface TrendingItem {
  id: string;
  title: string;
  category: string;
  beforeImage?: string;
  image: string;
  promptDescription: string;
  transformationType: string;
  route: RoutePath;
}

export interface FunExperience {
  id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  route: RoutePath;
}

export interface IdeaItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  count: string;
  route: RoutePath;
}
