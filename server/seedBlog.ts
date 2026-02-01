import { storage } from "./storage";
import OpenAI from "openai";

const SEO_TOPICS = [
  {
    topic: "How Much Does a Custom Website Cost in 2026?",
    keywords: ["website cost", "web development pricing", "custom website", "agency prices"],
    category: "Pricing"
  },
  {
    topic: "Why Every Nashville Business Needs a Mobile-First Website",
    keywords: ["mobile-first design", "Nashville web development", "responsive design", "local business website"],
    category: "Web Design"
  },
  {
    topic: "AI-Powered Websites: The Future of Small Business Growth",
    keywords: ["AI website", "small business AI", "automated websites", "chatbots"],
    category: "AI & Technology"
  },
  {
    topic: "E-Commerce vs Traditional Website: Which Does Your Business Need?",
    keywords: ["ecommerce website", "online store", "business website", "sell online"],
    category: "E-Commerce"
  },
  {
    topic: "5 Signs Your Website Is Costing You Customers",
    keywords: ["website optimization", "conversion rate", "user experience", "website mistakes"],
    category: "Web Design"
  }
];

async function generateBlogPost(openai: OpenAI, topic: string, keywords: string[], category: string) {
  const systemPrompt = `You are an expert SEO content writer for DarkWave Studios, a premium web development agency in Nashville, TN. 
Write engaging, informative blog posts that:
- Target the provided keywords naturally (use each keyword 2-3 times)
- Follow a professional but approachable tone
- Include proper headings (H2, H3) with keywords
- Are optimized for search engines with meta descriptions
- Provide actionable value to readers
- Are 1000-1500 words long
- Include a compelling call-to-action at the end
- Use schema-friendly structure

Return JSON with exactly these fields:
- title: SEO-optimized title (60 chars max)
- slug: URL-friendly slug
- excerpt: Meta description (150-160 chars, includes main keyword)
- content: Full article in markdown format
- tags: Array of 5-8 relevant tags
- category: The provided category`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Write an SEO-optimized blog post about: ${topic}\nTarget keywords: ${keywords.join(", ")}\nCategory: ${category}` }
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function seedBlog() {
  try {
    const existingPosts = await storage.getBlogPosts(false);
    
    if (existingPosts.length >= 3) {
      console.log(`[Blog Seed] Found ${existingPosts.length} existing posts, skipping seed`);
      return;
    }

    const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
    const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
    
    if (!apiKey) {
      console.log("[Blog Seed] OpenAI API key not configured, skipping blog generation");
      return;
    }

    const openai = new OpenAI({ apiKey, baseURL });
    
    console.log("[Blog Seed] Generating SEO-optimized blog posts...");
    
    const postsToGenerate = SEO_TOPICS.slice(0, 3 - existingPosts.length);
    
    for (const { topic, keywords, category } of postsToGenerate) {
      try {
        console.log(`[Blog Seed] Generating: ${topic}`);
        const blogData = await generateBlogPost(openai, topic, keywords, category);
        
        await storage.createBlogPost({
          title: blogData.title,
          slug: blogData.slug,
          excerpt: blogData.excerpt,
          content: blogData.content,
          tags: blogData.tags,
          category: blogData.category || category,
          published: true,
          publishedAt: new Date(),
          author: "DarkWave Studios"
        });
        
        console.log(`[Blog Seed] Published: ${blogData.title}`);
      } catch (err) {
        console.error(`[Blog Seed] Failed to generate post for "${topic}":`, err);
      }
    }
    
    console.log("[Blog Seed] Blog seeding complete!");
  } catch (error) {
    console.error("[Blog Seed] Error seeding blog:", error);
  }
}
