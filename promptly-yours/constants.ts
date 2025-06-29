
import { NavItem, Step, FeaturePoint, Testimonial, Project, AiService, AiModel } from './types';

export const APP_NAME = "Promptly Yours";

export const NAV_ITEMS_LOGGED_IN: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: 'HomeIcon' },
  { name: 'Arcade Customizer', path: '/chatbot-builder', icon: 'CubeIcon' },
  { name: 'My Arcade', path: '/my-arcade', icon: 'CubeTransparentIcon' },
  { name: 'Content Writer', path: '/content-writer', icon: 'PencilAltIcon' },
  { name: 'Proofreading', path: '/proofreading', icon: 'BadgeCheckIcon' },
  { name: 'Data Extraction', path: '/data-extraction', icon: 'DocumentReportIcon' },
  { name: 'Resume Builder', path: '/resume-builder', icon: 'IdentificationIcon' },
  { name: 'Settings', path: '/settings', icon: 'CogIcon' },
];

export const HOW_IT_WORKS_STEPS: Step[] = [
  { id: 1, title: 'Select AI Model', description: 'Browse our diverse range of AI tools and choose the one that fits your task.', icon: 'CursorClickIcon' },
  { id: 2, title: 'Submit Task', description: 'Provide your input, requirements, and let the AI get to work.', icon: 'UploadIcon' },
  { id: 3, title: 'Get Results', description: 'Receive high-quality, AI-generated results quickly and efficiently.', icon: 'CheckCircleIcon' },
];

export const WHY_CHOOSE_US_POINTS: FeaturePoint[] = [
  { id: 1, title: 'Affordability', description: 'Pay only for what you use with our task-based pricing. No hidden fees, no subscriptions!', icon: 'CurrencyDollarIcon' },
  { id: 2, title: 'Flexibility', description: 'Access a wide variety of AI models for different needs, all in one place, anytime.', icon: 'SwitchHorizontalIcon' },
  { id: 3, title: 'Top AI Variety', description: 'We integrate leading AI technologies like Gemini, OpenAI, and specialized models.', icon: 'CollectionIcon' },
  { id: 4, title: 'Instant Access', description: 'Get started immediately. No complex setups or lengthy onboarding processes.', icon: 'LightningBoltIcon' },
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  { id: 't1', name: 'Alice Wonderland', avatarUrl: 'https://picsum.photos/seed/alice/100/100', quote: 'This platform revolutionized how my startup handles content generation. Affordable and incredibly powerful!', projectName: 'AI Blog Post Series', projectImageUrl: 'https://picsum.photos/seed/blogpost/400/300' },
  { id: 't2', name: 'Bob The Builder', avatarUrl: 'https://picsum.photos/seed/bob/100/100', quote: 'The AI code assistant helped us identify critical bugs and refactor our legacy systems way faster than expected.', projectName: 'Code Modernization Project', projectImageUrl: 'https://picsum.photos/seed/codemodern/400/300' },
  { id: 't3', name: 'Carol Danvers', avatarUrl: 'https://picsum.photos/seed/carol/100/100', quote: 'Generating marketing copy for our campaigns is now a breeze. The quality is consistently high!', projectName: 'Ad Campaign Creatives', projectImageUrl: 'https://picsum.photos/seed/adcreative/400/300' },
];

export const INSPIRED_PROJECTS_DATA: Project[] = [
  { id: 'proj1', name: 'E-commerce Product Descriptions', imageUrl: 'https://picsum.photos/seed/projectA/400/300', description: 'AI generated compelling product descriptions that boosted sales by 20%.', aiModelUsed: 'Gemini Text Generation', tags: ['E-commerce', 'Copywriting'] },
  { id: 'proj2', name: 'Abstract Art Series', imageUrl: 'https://picsum.photos/seed/projectB/400/300', description: 'A stunning collection of abstract art created by an image generation AI.', aiModelUsed: 'Imagen', tags: ['Art', 'Image Generation'] },
  { id: 'proj3', name: 'Automated Code Review', imageUrl: 'https://picsum.photos/seed/projectC/400/300', description: 'AI analyzed and suggested improvements for a large codebase, saving developer hours.', aiModelUsed: 'Gemini for Code', tags: ['Development', 'Code Analysis'] },
  { id: 'proj4', name: 'Personalized Story Creation', imageUrl: 'https://picsum.photos/seed/projectD/400/300', description: 'AI crafts unique stories for children based on their preferences.', aiModelUsed: 'Gemini Storyteller', tags: ['Creative Writing', 'Personalization'] },
];

export const USER_INTERESTS_SERVICES: AiService[] = [
    { id: 'servChatbot', name: "AI Arcade Builder", description: "Design a custom arcade, play instantly, and then download or deploy it. Features smart AI-driven game logic.", icon: 'CubeIcon', category: "Gaming" },
    { id: 'servContent', name: "AI Content Writer", description: "Generate structured articles and blog posts. Provide a topic and let the AI create an outline and write the content section by section.", icon: 'PencilAltIcon', category: "Content Creation" },
    { id: 'servProofread', name: "Proofreading & Editing", description: "Rapid, accurate error detection; consistent quality across documents.", icon: 'BadgeCheckIcon', category: 'Productivity' },
    { id: 'servDataExtract', name: "Data Entry & Extraction", description: "Automate data extraction from documents like invoices and receipts with high accuracy.", icon: 'DocumentReportIcon', category: 'Data Processing' },
    { id: 'servResume', name: "Resume/Cover Letter Builder", description: "ATS-friendly resume optimization and tailored cover letter generation.", icon: 'IdentificationIcon', category: 'Career' },
    { id: 'serv2', name: 'AI Code Generator', description: 'Generate code snippets for various languages.', icon: 'CodeIcon', category: 'Development' },
    { id: 'serv3', name: 'Content Summarizer', description: 'Summarize long articles instantly.', icon: 'DocumentTextIcon', category: 'Productivity' },
    { id: 'serv4', name: 'Image Upscaler', description: 'Enhance image resolution with AI.', icon: 'PhotographIcon', category: 'Image Editing' },
];

export const BEST_AI_MODELS_DATA: AiModel[] = [
  { id: 'model1', name: 'Gemini Pro Vision', provider: 'Google', costPerTask: '$0.05/image analysis', performanceMetrics: { accuracy: '92%', speed: 'Fast' }, description: 'Advanced multimodal model for image understanding and generation.', tags: ['Vision', 'Multimodal'], icon: 'EyeIcon' },
  { id: 'model2', name: 'Gemini Flash', provider: 'Google', costPerTask: '$0.002/1k chars', performanceMetrics: { speed: 'Very Fast', quality: 'High' }, description: 'Optimized for speed and efficiency in text-based tasks.', tags: ['Text', 'Speed'], icon: 'LightningBoltIcon' },
  { id: 'model3', name: 'Imagen 3', provider: 'Google', costPerTask: '$0.10/image', performanceMetrics: { quality: 'Photorealistic' }, description: 'State-of-the-art image generation model for creative visuals.', tags: ['Image Generation', 'Creative'], icon: 'PhotographIcon' },
  { id: 'model4', name: 'OpenAI GPT-4o', provider: 'OpenAI', costPerTask: '$0.01/1k tokens', performanceMetrics: { accuracy: '95%', quality: 'Excellent' }, description: 'Powerful model for complex reasoning and text generation.', tags: ['Text', 'Reasoning'], icon: 'ChatAlt2Icon' },
];

// DEFAULT_USER is kept for now as a fallback or for users not logged in, 
// but authenticated user data from Firebase will take precedence.
export const DEFAULT_USER = {
  name: 'Alex Nova', // This name will be overridden by Firebase user's display name if logged in.
  interests: ['Gaming', 'Image Generation', 'Productivity', 'Chatbots', 'Content Creation', 'Proofreading & Editing', 'Data Processing', 'Career'],
};
