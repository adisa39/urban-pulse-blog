import { Post, Author, Category } from '@/types';

export const authors: Author[] = [
  {
    id: '1',
    name: 'Alex Mercer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    bio: 'Senior writer and tech enthusiast with 10+ years of experience covering technology, culture, and innovation.',
    social: { twitter: 'alexmercer', linkedin: 'alexmercer', github: 'alexmercer' },
  },
  {
    id: '2',
    name: 'Sofia Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    bio: 'Design thinker and UX researcher passionate about creating meaningful digital experiences.',
    social: { twitter: 'sofiachen', linkedin: 'sofiachen' },
  },
];

export const categories: Category[] = [
  { id: '1', name: 'Technology', slug: 'technology', description: 'Latest in tech', color: 'blue' },
  { id: '2', name: 'Design', slug: 'design', description: 'UI/UX and visual design', color: 'purple' },
  { id: '3', name: 'Business', slug: 'business', description: 'Business insights', color: 'green' },
  { id: '4', name: 'Culture', slug: 'culture', description: 'Art and culture', color: 'orange' },
  { id: '5', name: 'Science', slug: 'science', description: 'Scientific discoveries', color: 'teal' },
];

export const initialPosts: Post[] = [
  {
    id: '1',
    slug: 'the-future-of-artificial-intelligence',
    title: 'The Future of Artificial Intelligence: What Lies Ahead',
    excerpt: 'As AI systems grow more sophisticated, we explore the transformative potential and ethical considerations shaping tomorrow\'s world.',
    content: `<h2>The Dawn of a New Era</h2>
<p>Artificial intelligence has moved from science fiction to everyday reality with breathtaking speed. From the recommendation algorithms that curate our news feeds to the large language models that can write poetry, code software, and hold nuanced conversations, AI is fundamentally reshaping how we live and work.</p>

<p>But what does the next decade hold? As we stand at this technological inflection point, researchers, ethicists, and industry leaders are grappling with questions that will define the trajectory of human civilization.</p>

<h2>The Rise of Multimodal AI</h2>
<p>One of the most significant developments is the emergence of multimodal AI systems—models that can understand and generate text, images, audio, and video simultaneously. These systems don't just process information in isolated silos; they integrate multiple forms of data to develop richer, more contextual understanding.</p>

<blockquote>The most powerful AI systems of the future won't be those that excel at a single task, but those that can fluidly navigate between different types of information and reasoning.</blockquote>

<p>Consider how a doctor of the future might use AI: not just to analyze a patient's written medical history, but to simultaneously examine diagnostic images, interpret lab results, consider genetic data, and even analyze subtle vocal patterns that might indicate neurological conditions. This integrated approach could revolutionize healthcare, making expert-level diagnosis available to anyone, anywhere.</p>

<h2>Autonomous Systems and the Question of Agency</h2>
<p>Perhaps the most philosophically profound development is the emergence of AI agents—systems that don't just respond to prompts but actively pursue goals, make plans, and take actions in the world. These systems can browse the web, write and execute code, manage files, and interact with external services.</p>

<p>This raises fundamental questions about agency, responsibility, and trust. When an AI agent makes a decision that affects people's lives—approving a loan, diagnosing an illness, determining a prison sentence—who is accountable?</p>

<h2>The Path Forward</h2>
<p>The future of AI isn't predetermined. It will be shaped by the choices we make today: the regulations we implement, the values we encode into our systems, the investments we make in AI safety research, and the frameworks we develop for international cooperation.</p>

<p>What seems clear is that AI will be transformative. The question is not whether it will change our world, but how—and whether those changes will reflect our deepest values and aspirations for human flourishing.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop',
    category: 'Technology',
    tags: ['AI', 'Machine Learning', 'Future', 'Technology'],
    author: authors[0],
    publishedAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
    readTime: 8,
    featured: true,
    published: true,
    views: 12450,
    metaDescription: 'Explore the transformative potential of artificial intelligence and the ethical considerations shaping our technological future.',
    metaKeywords: ['AI', 'artificial intelligence', 'future technology', 'machine learning'],
  },
  {
    id: '2',
    slug: 'design-systems-that-scale',
    title: 'Building Design Systems That Actually Scale',
    excerpt: 'How the world\'s most successful companies create cohesive design languages that grow with their products.',
    content: `<h2>Why Design Systems Matter</h2>
<p>A design system is more than a collection of UI components—it's a shared language between designers and developers, a philosophy about how digital products should look and feel, and a strategic investment in consistency and speed.</p>

<p>The companies that get this right—Airbnb, Shopify, IBM—don't just ship better products. They ship better products faster, with less friction between teams and higher confidence in quality.</p>

<h2>The Foundation: Design Tokens</h2>
<p>Before you can build components, you need to establish the atomic units of your design system: design tokens. These are the named variables that represent your foundational design decisions—colors, typography scales, spacing values, border radii, shadow values, and motion curves.</p>

<p>Good design tokens have several characteristics. They're named semantically (--color-text-primary rather than --color-gray-900), they're platform-agnostic (expressible in CSS, iOS, Android), and they're organized hierarchically (primitive tokens feeding into semantic tokens feeding into component tokens).</p>

<h2>Component Architecture</h2>
<p>With your token foundation established, you can begin building components. The key insight here is that components should be designed for composition, not configuration. Rather than creating a Button component with dozens of props controlling every aspect of its appearance, create focused components that can be combined.</p>

<blockquote>The measure of a good component isn't how much it can do—it's how clearly it does one thing well.</blockquote>

<h2>Documentation as a First-Class Citizen</h2>
<p>A design system without documentation is just a collection of files. Documentation transforms your system into something teams can actually use and adopt. But documentation isn't just about explaining how components work—it's about communicating intent, constraints, and best practices.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=630&fit=crop',
    category: 'Design',
    tags: ['Design Systems', 'UX', 'Frontend', 'UI'],
    author: authors[1],
    publishedAt: '2024-12-10T09:00:00Z',
    updatedAt: '2024-12-10T09:00:00Z',
    readTime: 6,
    featured: true,
    published: true,
    views: 8920,
    metaDescription: 'Learn how to build design systems that scale with your product and team.',
    metaKeywords: ['design system', 'UI', 'UX', 'frontend development'],
  },
  {
    id: '3',
    slug: 'remote-work-revolution',
    title: 'The Remote Work Revolution: Three Years Later',
    excerpt: 'What have we actually learned about productivity, culture, and connection after the great remote work experiment?',
    content: `<h2>Taking Stock</h2>
<p>Three years after the pandemic forced a global experiment in remote work, the results are nuanced. Productivity metrics tell one story, employee wellbeing tells another, and organizational culture tells a third. The truth, as always, is complicated.</p>

<p>Companies that embraced remote work as a temporary necessity are now confronting it as a permanent feature of the landscape. And the decisions they make—about office mandates, hybrid arrangements, and distributed-first cultures—will shape not just their own futures, but the broader geography of work itself.</p>

<h2>What the Data Shows</h2>
<p>The productivity debate has been contentious and often politically charged. Early studies suggested remote workers were more productive; later research found gaps, particularly in collaborative and creative work. The honest answer is that productivity is highly context-dependent.</p>

<p>Individual focused work—writing, coding, analysis—often improves in remote environments, freed from office interruptions and commute exhaustion. But collaborative work, mentorship, spontaneous knowledge-sharing, and cultural transmission suffer when people aren't physically together.</p>

<h2>The Culture Question</h2>
<p>Perhaps the deepest challenge of remote work isn't productivity—it's culture. Organizational culture isn't built through Zoom calls and Slack messages; it emerges from the accumulated micro-interactions of people sharing physical space over time.</p>

<blockquote>Culture isn't what you say it is. It's what happens when no one is watching—the conversations in hallways, the lunch table dynamics, the way senior people treat junior colleagues in unguarded moments.</blockquote>`,
    coverImage: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=1200&h=630&fit=crop',
    category: 'Business',
    tags: ['Remote Work', 'Culture', 'Productivity', 'Future of Work'],
    author: authors[0],
    publishedAt: '2024-12-05T08:00:00Z',
    updatedAt: '2024-12-05T08:00:00Z',
    readTime: 7,
    featured: false,
    published: true,
    views: 6730,
    metaDescription: 'An honest assessment of remote work three years after the pandemic changed everything.',
    metaKeywords: ['remote work', 'hybrid work', 'productivity', 'workplace culture'],
  },
  {
    id: '4',
    slug: 'the-science-of-sleep',
    title: 'The Science of Sleep: Why Your Brain Needs the Dark',
    excerpt: 'New research reveals just how profoundly sleep shapes our cognition, emotional regulation, and long-term health.',
    content: `<h2>The Sleep Debt Crisis</h2>
<p>Modern society has declared war on sleep, and sleep is winning—but not in the way we'd hope. Chronic sleep deprivation has become a public health epidemic, with consequences ranging from impaired cognition and emotional dysregulation to increased risk of cardiovascular disease, diabetes, and neurodegenerative conditions.</p>

<p>Despite decades of research demonstrating sleep's critical importance, we continue to treat it as a luxury rather than a biological necessity. The cultural glorification of sleep deprivation—"I'll sleep when I'm dead"—has real, measurable costs.</p>

<h2>What Happens While You Sleep</h2>
<p>Sleep is not, as was once thought, a passive state of neural silence. It's a period of intense, coordinated biological activity. During sleep, your brain cycles through distinct stages, each with specific functions.</p>

<p>During NREM (non-rapid eye movement) sleep, particularly the deep slow-wave stages, your brain consolidates memories—transferring experiences from short-term hippocampal storage to long-term cortical representation. It also clears metabolic waste products through the glymphatic system, including amyloid-beta proteins associated with Alzheimer's disease.</p>

<h2>The Circadian System</h2>
<p>Your sleep-wake cycle is governed by a sophisticated circadian timing system—essentially a biological clock that synchronizes your physiology with the 24-hour cycle of light and dark. This clock is primarily set by light exposure, particularly morning light and the absence of light in the evening.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&h=630&fit=crop',
    category: 'Science',
    tags: ['Sleep', 'Neuroscience', 'Health', 'Science'],
    author: authors[1],
    publishedAt: '2024-11-28T07:00:00Z',
    updatedAt: '2024-11-28T07:00:00Z',
    readTime: 9,
    featured: false,
    published: true,
    views: 15200,
    metaDescription: 'Discover the fascinating science behind sleep and why getting enough rest is critical for your brain and body.',
    metaKeywords: ['sleep science', 'neuroscience', 'health', 'circadian rhythm'],
  },
  {
    id: '5',
    slug: 'crypto-art-cultural-revolution',
    title: 'Digital Art and the Question of Ownership',
    excerpt: 'How blockchain technology is challenging centuries-old assumptions about what it means to own a piece of art.',
    content: `<h2>A New Kind of Scarcity</h2>
<p>For centuries, the value of art has been intimately tied to its physical uniqueness. A painting by Vermeer is valuable partly because of its historical significance and artistic merit, but also because there is one and only one original. Reproductions, however faithful, are not the same thing.</p>

<p>Digital art has always challenged this logic. A digital file can be copied perfectly and infinitely. There is no degradation, no original versus copy—just identical instances of the same data. This seemed to consign digital art to a realm of perpetual non-ownership.</p>

<h2>The Cultural Response</h2>
<p>Beyond the technology and economics, something culturally significant is happening. Digital artists who had long struggled to monetize their work found in NFTs a direct relationship with collectors. Musicians explored new models for releasing music. Writers experimented with tokenized publishing.</p>

<p>The most interesting question isn't whether NFT markets will recover or collapse—it's what this moment revealed about how we think about ownership, value, and cultural contribution in the digital age.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop',
    category: 'Culture',
    tags: ['Digital Art', 'NFT', 'Blockchain', 'Culture'],
    author: authors[0],
    publishedAt: '2024-11-20T11:00:00Z',
    updatedAt: '2024-11-20T11:00:00Z',
    readTime: 5,
    featured: false,
    published: true,
    views: 4320,
    metaDescription: 'Exploring how digital ownership is transforming art markets and cultural value.',
    metaKeywords: ['digital art', 'NFT', 'blockchain', 'art market'],
  },
  {
    id: '6',
    slug: 'typescript-best-practices-2024',
    title: 'TypeScript Best Practices for Large Scale Applications',
    excerpt: 'Battle-tested patterns and architectural decisions for teams building serious TypeScript applications.',
    content: `<h2>Why TypeScript at Scale</h2>
<p>TypeScript has moved from optional enhancement to industry standard for large-scale JavaScript applications. But using TypeScript and using it well are different things. As codebases grow, the decisions you make about type architecture compound—good decisions accelerate development, bad ones create technical debt that's hard to unwind.</p>

<h2>Type-First Design</h2>
<p>The most impactful shift you can make is adopting a type-first design philosophy. Before writing implementation code, define your types. This forces you to think carefully about data shapes, relationships, and constraints—catching logical errors before they become bugs.</p>

<p>This approach also makes your types the living documentation of your system. When a new engineer joins the team, they can understand the domain model by reading the type definitions, not by reverse-engineering the implementation.</p>

<h2>The Art of Generic Constraints</h2>
<p>Generics are TypeScript's most powerful feature and often its most misused. The goal is to write code that's both flexible and type-safe—but overly complex generic hierarchies create types that are technically correct but practically incomprehensible.</p>

<blockquote>The best types are the ones your team can read and understand without a TypeScript PhD. Correctness matters, but so does maintainability.</blockquote>`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
    category: 'Technology',
    tags: ['TypeScript', 'JavaScript', 'Programming', 'Best Practices'],
    author: authors[1],
    publishedAt: '2024-11-15T08:30:00Z',
    updatedAt: '2024-11-15T08:30:00Z',
    readTime: 10,
    featured: false,
    published: true,
    views: 9870,
    metaDescription: 'Learn TypeScript best practices for building scalable, maintainable large applications.',
    metaKeywords: ['TypeScript', 'JavaScript', 'programming', 'web development'],
  },
];

// In-memory store (in production, use a real database)
let postsStore: Post[] = [...initialPosts];

export const getPosts = (publishedOnly = true): Post[] => {
  return publishedOnly
    ? postsStore.filter(p => p.published).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    : postsStore.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const getPostBySlug = (slug: string): Post | undefined => {
  return postsStore.find(p => p.slug === slug);
};

export const getFeaturedPosts = (): Post[] => {
  return postsStore.filter(p => p.featured && p.published).slice(0, 3);
};

export const getPostsByCategory = (category: string): Post[] => {
  return postsStore.filter(p => p.category === category && p.published);
};

export const createPost = (post: Omit<Post, 'id' | 'views'>): Post => {
  const newPost: Post = { ...post, id: Date.now().toString(), views: 0 };
  postsStore = [newPost, ...postsStore];
  return newPost;
};

export const updatePost = (id: string, updates: Partial<Post>): Post | null => {
  const idx = postsStore.findIndex(p => p.id === id);
  if (idx === -1) return null;
  postsStore[idx] = { ...postsStore[idx], ...updates, updatedAt: new Date().toISOString() };
  return postsStore[idx];
};

export const deletePost = (id: string): boolean => {
  const before = postsStore.length;
  postsStore = postsStore.filter(p => p.id !== id);
  return postsStore.length < before;
};

export const incrementViews = (slug: string): void => {
  const post = postsStore.find(p => p.slug === slug);
  if (post) post.views += 1;
};

export const getStats = () => ({
  totalPosts: postsStore.length,
  publishedPosts: postsStore.filter(p => p.published).length,
  draftPosts: postsStore.filter(p => !p.published).length,
  totalViews: postsStore.reduce((sum, p) => sum + p.views, 0),
  featuredPosts: postsStore.filter(p => p.featured).length,
  categories: categories.length,
});
