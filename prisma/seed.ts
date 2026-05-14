import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const password = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@meridian.blog' },
    update: {},
    create: {
      email: 'admin@meridian.blog',
      password,
      name: 'Alex Mercer',
      bio: 'Senior writer and tech enthusiast with 10+ years of experience.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      role: 'ADMIN',
      twitterHandle: 'alexmercer',
    },
  });

  const author2 = await prisma.user.upsert({
    where: { email: 'sofia@meridian.blog' },
    update: {},
    create: {
      email: 'sofia@meridian.blog',
      password,
      name: 'Sofia Chen',
      bio: 'Design thinker and UX researcher passionate about digital experiences.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      role: 'AUTHOR',
      twitterHandle: 'sofiachen',
    },
  });

  // Tags
  const tagNames = ['AI', 'Machine Learning', 'Future', 'Technology', 'Design Systems', 'UX', 'Frontend', 'Remote Work', 'Productivity', 'Sleep', 'Health', 'Digital Art', 'TypeScript', 'JavaScript'];
  const tags: Record<string, { id: string }> = {};
  for (const name of tagNames) {
    tags[name] = await prisma.tag.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Posts
  const posts = [
    {
      slug: 'the-future-of-artificial-intelligence',
      title: 'The Future of Artificial Intelligence: What Lies Ahead',
      excerpt: "As AI systems grow more sophisticated, we explore the transformative potential and ethical considerations shaping tomorrow's world.",
      content: `<h2>The Dawn of a New Era</h2><p>Artificial intelligence has moved from science fiction to everyday reality with breathtaking speed. From the recommendation algorithms that curate our news feeds to the large language models that can write poetry, code software, and hold nuanced conversations, AI is fundamentally reshaping how we live and work.</p><p>But what does the next decade hold? As we stand at this technological inflection point, researchers, ethicists, and industry leaders are grappling with questions that will define the trajectory of human civilization.</p><h2>The Rise of Multimodal AI</h2><p>One of the most significant developments is the emergence of multimodal AI systems—models that can understand and generate text, images, audio, and video simultaneously. These systems don't just process information in isolated silos; they integrate multiple forms of data to develop richer, more contextual understanding.</p><blockquote>The most powerful AI systems of the future won't be those that excel at a single task, but those that can fluidly navigate between different types of information and reasoning.</blockquote><p>Consider how a doctor of the future might use AI: not just to analyze a patient's written medical history, but to simultaneously examine diagnostic images, interpret lab results, consider genetic data, and even analyze subtle vocal patterns that might indicate neurological conditions.</p><h2>The Path Forward</h2><p>The future of AI isn't predetermined. It will be shaped by the choices we make today: the regulations we implement, the values we encode into our systems, the investments we make in AI safety research, and the frameworks we develop for international cooperation.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop',
      category: 'Technology',
      tagNames: ['AI', 'Machine Learning', 'Future', 'Technology'],
      authorId: admin.id,
      published: true, featured: true, views: 12450, readTime: 8,
      metaDescription: 'Explore the transformative potential of artificial intelligence and the ethical considerations shaping our technological future.',
    },
    {
      slug: 'design-systems-that-scale',
      title: 'Building Design Systems That Actually Scale',
      excerpt: "How the world's most successful companies create cohesive design languages that grow with their products.",
      content: `<h2>Why Design Systems Matter</h2><p>A design system is more than a collection of UI components—it's a shared language between designers and developers, a philosophy about how digital products should look and feel, and a strategic investment in consistency and speed.</p><p>The companies that get this right—Airbnb, Shopify, IBM—don't just ship better products. They ship better products faster, with less friction between teams and higher confidence in quality.</p><h2>The Foundation: Design Tokens</h2><p>Before you can build components, you need to establish the atomic units of your design system: design tokens. These are the named variables that represent your foundational design decisions—colors, typography scales, spacing values, border radii, shadow values, and motion curves.</p><blockquote>The measure of a good component isn't how much it can do—it's how clearly it does one thing well.</blockquote><h2>Documentation as a First-Class Citizen</h2><p>A design system without documentation is just a collection of files. Documentation transforms your system into something teams can actually use and adopt.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=630&fit=crop',
      category: 'Design',
      tagNames: ['Design Systems', 'UX', 'Frontend'],
      authorId: author2.id,
      published: true, featured: true, views: 8920, readTime: 6,
      metaDescription: 'Learn how to build design systems that scale with your product and team.',
    },
    {
      slug: 'remote-work-revolution',
      title: 'The Remote Work Revolution: Three Years Later',
      excerpt: 'What have we actually learned about productivity, culture, and connection after the great remote work experiment?',
      content: `<h2>Taking Stock</h2><p>Three years after the pandemic forced a global experiment in remote work, the results are nuanced. Productivity metrics tell one story, employee wellbeing tells another, and organizational culture tells a third. The truth, as always, is complicated.</p><h2>What the Data Shows</h2><p>The productivity debate has been contentious and often politically charged. Early studies suggested remote workers were more productive; later research found gaps, particularly in collaborative and creative work.</p><blockquote>Culture isn't what you say it is. It's what happens when no one is watching—the conversations in hallways, the lunch table dynamics, the way senior people treat junior colleagues in unguarded moments.</blockquote>`,
      coverImage: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=1200&h=630&fit=crop',
      category: 'Business',
      tagNames: ['Remote Work', 'Productivity'],
      authorId: admin.id,
      published: true, featured: false, views: 6730, readTime: 7,
      metaDescription: 'An honest assessment of remote work three years after the pandemic changed everything.',
    },
    {
      slug: 'the-science-of-sleep',
      title: 'The Science of Sleep: Why Your Brain Needs the Dark',
      excerpt: 'New research reveals just how profoundly sleep shapes our cognition, emotional regulation, and long-term health.',
      content: `<h2>The Sleep Debt Crisis</h2><p>Modern society has declared war on sleep, and sleep is winning—but not in the way we'd hope. Chronic sleep deprivation has become a public health epidemic, with consequences ranging from impaired cognition and emotional dysregulation to increased risk of cardiovascular disease, diabetes, and neurodegenerative conditions.</p><h2>What Happens While You Sleep</h2><p>Sleep is not, as was once thought, a passive state of neural silence. It's a period of intense, coordinated biological activity. During sleep, your brain cycles through distinct stages, each with specific functions.</p><h2>The Circadian System</h2><p>Your sleep-wake cycle is governed by a sophisticated circadian timing system—essentially a biological clock that synchronizes your physiology with the 24-hour cycle of light and dark.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&h=630&fit=crop',
      category: 'Science',
      tagNames: ['Sleep', 'Health'],
      authorId: author2.id,
      published: true, featured: false, views: 15200, readTime: 9,
      metaDescription: 'Discover the fascinating science behind sleep and why getting enough rest is critical for your brain and body.',
    },
    {
      slug: 'digital-art-and-ownership',
      title: 'Digital Art and the Question of Ownership',
      excerpt: 'How blockchain technology is challenging centuries-old assumptions about what it means to own a piece of art.',
      content: `<h2>A New Kind of Scarcity</h2><p>For centuries, the value of art has been intimately tied to its physical uniqueness. A painting by Vermeer is valuable partly because of its historical significance and artistic merit, but also because there is one and only one original.</p><h2>The Cultural Response</h2><p>Beyond the technology and economics, something culturally significant is happening. Digital artists who had long struggled to monetize their work found in NFTs a direct relationship with collectors.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop',
      category: 'Culture',
      tagNames: ['Digital Art'],
      authorId: admin.id,
      published: true, featured: false, views: 4320, readTime: 5,
      metaDescription: 'Exploring how digital ownership is transforming art markets and cultural value.',
    },
    {
      slug: 'typescript-best-practices-2024',
      title: 'TypeScript Best Practices for Large Scale Applications',
      excerpt: 'Battle-tested patterns and architectural decisions for teams building serious TypeScript applications.',
      content: `<h2>Why TypeScript at Scale</h2><p>TypeScript has moved from optional enhancement to industry standard for large-scale JavaScript applications. But using TypeScript and using it well are different things.</p><h2>Type-First Design</h2><p>The most impactful shift you can make is adopting a type-first design philosophy. Before writing implementation code, define your types.</p><blockquote>The best types are the ones your team can read and understand without a TypeScript PhD. Correctness matters, but so does maintainability.</blockquote>`,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
      category: 'Technology',
      tagNames: ['TypeScript', 'JavaScript', 'Frontend'],
      authorId: author2.id,
      published: true, featured: false, views: 9870, readTime: 10,
      metaDescription: 'Learn TypeScript best practices for building scalable, maintainable large applications.',
    },
  ];

  for (const { tagNames: postTags, ...data } of posts) {
    await prisma.post.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        tags: { connect: postTags.map(name => ({ name })) },
      },
    });
  }

  // Default settings
  const settings = [
    { key: 'siteName', value: 'The Meridian' },
    { key: 'siteUrl', value: 'https://meridian.blog' },
    { key: 'siteDescription', value: 'Thoughtful writing on technology, design, business, science and culture.' },
    { key: 'postsPerPage', value: '12' },
    { key: 'twitterHandle', value: '@meridian' },
    { key: 'enableComments', value: 'true' },
    { key: 'enableNewsletter', value: 'true' },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  console.log('✅ Seed complete. Admin: admin@meridian.blog / admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
