import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, User, ArrowRight, Tag, Clock, Menu, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  author: string | null;
  category: string | null;
  tags: string[] | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function Blog() {
  const { data, isLoading } = useQuery<{ posts: BlogPost[] }>({
    queryKey: ["/api/blog?published=true"],
  });

  const posts = data?.posts || [];

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 7);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <SEOHead
        title="Blog - Web Development Insights & Resources"
        description="Expert insights on web development, AI integration, React development, and digital transformation. Stay updated with the latest trends and best practices from DarkWave Studios."
        keywords="web development blog, AI development, React tutorials, web app development, tech insights, coding best practices, Nashville web development"
        type="website"
        url="https://darkwavestudios.com/blog"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.com/" },
          { name: "Blog", url: "https://darkwavestudios.com/blog" }
        ]}
      />
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.12)',
        }}
      />
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent cursor-pointer" data-testid="link-logo">
              DarkWave
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/projects"><span className="text-white/70 hover:text-white transition-colors cursor-pointer" data-testid="link-nav-projects">Work</span></Link>
            <Link href="/services"><span className="text-white/70 hover:text-white transition-colors cursor-pointer" data-testid="link-nav-services">Services</span></Link>
            <Link href="/blog"><span className="text-cyan-400 cursor-pointer" data-testid="link-nav-blog">Blog</span></Link>
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500" data-testid="button-nav-contact">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Insights & Resources
              </span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              Expert insights on web development, AI integration, and digital transformation
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/40 text-lg mb-4">No blog posts yet</p>
              <p className="text-white/30">Check back soon for expert insights and resources</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-12 gap-4">
              {featuredPost && (
                <Card 
                  className="col-span-3 md:col-span-8 bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden group hover:border-cyan-400/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,255,255,0.2)]"
                  data-testid={`card-blog-${featuredPost.id}`}
                >
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <img 
                      src={featuredPost.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full text-cyan-400 text-xs font-semibold">
                        Featured
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    {featuredPost.category && (
                      <span className="text-cyan-400 text-sm font-medium mb-2 block">{featuredPost.category}</span>
                    )}
                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-white/60 mb-4 line-clamp-2">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-white/40 text-sm">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {featuredPost.author || 'DarkWave Team'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Link href={`/blog/${featuredPost.slug}`}>
                        <Button 
                          variant="ghost" 
                          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
                          data-testid={`button-read-${featuredPost.id}`}
                        >
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="col-span-3 md:col-span-4 space-y-4">
                <Card className="bg-gradient-to-br from-cyan-500/20 to-purple-600/20 backdrop-blur-xl border-cyan-400/30 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Subscribe to Updates</h3>
                  <p className="text-white/60 text-sm mb-4">Get the latest insights delivered to your inbox</p>
                  <input 
                    type="email" 
                    placeholder="your@email.com"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 mb-3"
                    data-testid="input-subscribe-email"
                  />
                  <Button 
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500"
                    data-testid="button-subscribe"
                  >
                    Subscribe
                  </Button>
                </Card>

                <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
                  <div className="space-y-2">
                    {['Web Development', 'AI & Automation', 'E-Commerce', 'SEO & Marketing', 'Case Studies'].map((cat) => (
                      <button 
                        key={cat}
                        className="block w-full text-left px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
                        data-testid={`button-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              {recentPosts.map((post, index) => (
                <Card 
                  key={post.id}
                  className={`col-span-3 md:col-span-4 bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden group hover:border-purple-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]`}
                  data-testid={`card-blog-${post.id}`}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={post.coverImage || `https://images.unsplash.com/photo-${1550745165 + index}-9bc53b8cbc25?w=600&q=80`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent" />
                  </div>
                  <CardContent className="p-4">
                    {post.category && (
                      <span className="text-purple-400 text-xs font-medium mb-1 block">{post.category}</span>
                    )}
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-white/50 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-white/40 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        5 min read
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {posts.length === 0 && (
                <Card className="col-span-3 md:col-span-12 bg-white/5 backdrop-blur-xl border-white/10 p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <Tag className="h-16 w-16 mx-auto mb-4 text-white/20" />
                    <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
                    <p className="text-white/50">
                      We're preparing expert insights on web development, AI, and digital transformation. 
                      Subscribe above to be notified when we publish.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} DarkWave Studios. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
