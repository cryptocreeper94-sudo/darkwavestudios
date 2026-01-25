import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Bot, Sparkles, Save, Eye, Trash2, Plus, Globe, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { adminRequest, getAdminQueryOptions } from "@/lib/adminApi";

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

interface GeneratedBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
}

export default function BlogAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [generatedBlog, setGeneratedBlog] = useState<GeneratedBlog | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data, isLoading } = useQuery<{ posts: BlogPost[] }>(
    getAdminQueryOptions(["/api/blog"])
  );

  const posts = data?.posts || [];

  const generateBlog = async () => {
    if (!topic.trim()) {
      toast({ title: "Error", description: "Please enter a topic", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await adminRequest("POST", "/api/blog/generate", {
        topic,
        keywords: keywords.split(",").map(k => k.trim()).filter(Boolean),
        tone,
      });

      const result = await response.json();
      if (result.success && result.blog) {
        setGeneratedBlog(result.blog);
        toast({ title: "Success", description: "Blog post generated!" });
      } else {
        throw new Error(result.error || "Failed to generate blog");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveBlog = useMutation({
    mutationFn: async (publish: boolean) => {
      if (!generatedBlog) return;

      const response = await adminRequest("POST", "/api/blog", {
        title: generatedBlog.title,
        slug: generatedBlog.slug,
        excerpt: generatedBlog.excerpt,
        content: generatedBlog.content,
        tags: generatedBlog.tags,
        category: generatedBlog.category,
        published: publish,
        publishedAt: publish ? new Date().toISOString() : null,
      });

      return response.json();
    },
    onSuccess: (_, publish) => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setGeneratedBlog(null);
      setTopic("");
      setKeywords("");
      toast({ 
        title: "Success", 
        description: publish ? "Blog post published!" : "Blog post saved as draft" 
      });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteBlog = useMutation({
    mutationFn: async (id: string) => {
      await adminRequest("DELETE", `/api/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Success", description: "Blog post deleted" });
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      await adminRequest("PATCH", `/api/blog/${id}`, {
        published,
        publishedAt: published ? new Date().toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Success", description: "Blog post updated" });
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" data-testid="link-back-admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold font-display text-primary">
                AI Blog Generator
              </h1>
              <p className="text-muted-foreground">Create SEO-optimized content with AI</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-12 gap-4">
          <Card className="col-span-3 md:col-span-4 glass-card border-white/10" data-testid="card-generate">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Generate New Post
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Topic / Title Idea</label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Why AI-Powered Websites Convert Better"
                  className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                  data-testid="input-topic"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Target Keywords (comma-separated)</label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., web development, AI, agency"
                  className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                  data-testid="input-keywords"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-foreground"
                  data-testid="select-tone"
                >
                  <option value="professional">Professional</option>
                  <option value="conversational">Conversational</option>
                  <option value="technical">Technical</option>
                  <option value="persuasive">Persuasive</option>
                </select>
              </div>

              <Button
                onClick={generateBlog}
                disabled={isGenerating || !topic.trim()}
                className="w-full bg-primary text-primary-foreground hover:opacity-90"
                data-testid="button-generate"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedBlog ? (
            <Card className="col-span-3 md:col-span-8 glass-card border-white/10" data-testid="card-preview">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Generated Preview
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => saveBlog.mutate(false)}
                      disabled={saveBlog.isPending}
                      className="border-white/20 text-foreground hover:bg-white/10"
                      data-testid="button-save-draft"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button
                      onClick={() => saveBlog.mutate(true)}
                      disabled={saveBlog.isPending}
                      className="bg-green-700 hover:bg-green-600 text-white"
                      data-testid="button-publish"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Publish Now
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-xs text-primary font-semibold">{generatedBlog.category}</span>
                  <h2 className="text-2xl font-bold font-display text-foreground mt-1">{generatedBlog.title}</h2>
                  <p className="text-muted-foreground mt-2">{generatedBlog.excerpt}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {generatedBlog.tags?.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-white/10 rounded-full text-xs text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="prose prose-invert max-w-none">
                  <div className="bg-white/5 rounded-lg p-4 max-h-96 overflow-y-auto text-muted-foreground whitespace-pre-wrap text-sm">
                    {generatedBlog.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="col-span-3 md:col-span-8 glass-card border-white/10 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground">Enter a topic and generate AI content</p>
              </div>
            </Card>
          )}

          <Card className="col-span-3 md:col-span-12 glass-card border-white/10" data-testid="card-posts">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">All Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No blog posts yet. Generate your first one above!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-muted-foreground text-xs border-b border-white/10">
                        <th className="text-left py-3 px-2">Title</th>
                        <th className="text-center py-3 px-2">Category</th>
                        <th className="text-center py-3 px-2">Status</th>
                        <th className="text-center py-3 px-2">Created</th>
                        <th className="text-right py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post) => (
                        <tr key={post.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-2">
                            <div className="font-medium text-foreground">{post.title}</div>
                            <div className="text-xs text-muted-foreground">/{post.slug}</div>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs">
                              {post.category || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {post.published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center text-muted-foreground text-sm">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePublish.mutate({ id: post.id, published: !post.published })}
                                className="text-muted-foreground hover:text-foreground"
                                data-testid={`button-toggle-${post.id}`}
                              >
                                {post.published ? 'Unpublish' : 'Publish'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteBlog.mutate(post.id)}
                                className="text-red-400 hover:text-red-300"
                                data-testid={`button-delete-${post.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
